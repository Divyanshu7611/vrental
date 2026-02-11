import { NextApiRequest } from "next";
import { File } from "multer";
import mongoose from "mongoose";

declare module "next" {
  export interface NextApiRequest {
    file?: File;
  }
}

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

export {};
