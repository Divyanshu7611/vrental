const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // Initialize Socket.IO
  const io = new Server(server, {
    path: "/socket.io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    // Join conversation room
    socket.on("join-conversation", (conversationID) => {
      socket.join(conversationID);
      console.log(`👤 User ${socket.id} joined conversation: ${conversationID}`);
    });

    // Leave conversation room
    socket.on("leave-conversation", (conversationID) => {
      socket.leave(conversationID);
      console.log(`👋 User ${socket.id} left conversation: ${conversationID}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  // Make io accessible globally
  global.io = io;

  server
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`🚀 Server ready on http://${hostname}:${port}`);
      console.log(`🔌 Socket.IO ready on ws://${hostname}:${port}`);

      const membershipCronEnabled =
        process.env.ENABLE_MEMBERSHIP_EXPIRY_CRON !== "false" &&
        (process.env.NODE_ENV === "production" ||
          process.env.ENABLE_MEMBERSHIP_EXPIRY_CRON === "true");

      if (!membershipCronEnabled) {
        console.log(
          "⏭ Membership expiry cron: disabled (production enables it; in dev set ENABLE_MEMBERSHIP_EXPIRY_CRON=true)"
        );
        return;
      }

      // Set CRON_SECRET in the same place as MONGODB_URL (e.g. EC2: .env, systemd Environment=, PM2 env).
      // Same value must exist on the server process; server.js sends it as x-cron-secret on internal requests.
      if (process.env.NODE_ENV === "production" && !process.env.CRON_SECRET?.trim()) {
        console.warn(
          "⚠️ CRON_SECRET is not set: /api/cron/check-expired-memberships is open to anyone who can reach your server. Set CRON_SECRET and restart."
        );
      }

      try {
        const cron = require("node-cron");
        // Loopback is correct on EC2 (e.g. vrental.in): cron runs inside this host and talks to Next on the same port.
        // Use https://vrental.in only if you call this route from outside; internal cron should stay on 127.0.0.1.
        const baseUrl =
          process.env.MEMBERSHIP_CRON_INTERNAL_BASE_URL?.trim() || `http://127.0.0.1:${port}`;
        const schedule = process.env.MEMBERSHIP_EXPIRY_CRON_SCHEDULE || "0 * * * *";

        const runMembershipExpiryJob = async () => {
          try {
            const headers = { Accept: "application/json" };
            const secret = process.env.CRON_SECRET?.trim();
            if (secret) {
              headers["x-cron-secret"] = secret;
            }
            const res = await fetch(`${baseUrl}/api/cron/check-expired-memberships`, {
              method: "POST",
              headers,
            });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) {
              console.error("Membership expiry cron HTTP error:", res.status, body);
              return;
            }
            const n = typeof body.count === "number" ? body.count : body.modifiedCount;
            if (n > 0) {
              console.log(`🕐 Membership expiry cron: deactivated ${n} apartment(s)`);
            }
          } catch (err) {
            console.error("Membership expiry cron error:", err);
          }
        };

        cron.schedule(schedule, () => {
          void runMembershipExpiryJob();
        });
        console.log(
          `🕐 Membership expiry cron scheduled (${schedule}) → ${baseUrl}/api/cron/check-expired-memberships`
        );

        if (process.env.MEMBERSHIP_EXPIRY_CRON_RUN_ON_START !== "false") {
          const startDelayMs = dev ? 12000 : 4000;
          setTimeout(() => {
            void runMembershipExpiryJob();
          }, startDelayMs);
        }
      } catch (e) {
        console.error("Failed to start membership expiry cron (install node-cron):", e);
      }
    });
});
