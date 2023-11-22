import Image from "next/image";
import { Button } from "@mantine/core";
import Table from "./components/Table";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Table />
    </main>
  );
}
