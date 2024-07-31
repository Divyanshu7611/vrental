import React from "react";
import Image from "next/image";

export default function authIcons({
  icon,
  description,
}: {
  icon: string;
  description: string;
}) {
  return (
    <div className="max-w-[106px] flex flex-col items-center justify-center">
      <Image src={icon} alt="icon" height={60} width={60} />
      <h3 className="text-xs text-center">{description}</h3>
    </div>
  );
}
