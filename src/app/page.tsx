import React from "react";
import { GET } from "./api/checkdb/route";

export default function Home() {

  GET()
  return (
    <>
      <h1 className="text-4xl font-bold underline">
      Hello world!
    </h1>
    </>
  );
}
