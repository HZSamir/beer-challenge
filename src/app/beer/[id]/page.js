"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table as MantineTable,
  ActionIcon,
  Tooltip,
  Modal,
  Fieldset,
  TextInput,
} from "@mantine/core";

export default function Page({ params }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://api.punkapi.com/v2/beers/${params.id}`);
      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const parsedData = await res.json();
      setData(parsedData[0]);
    };

    fetchData();
  }, [params.id]);

  console.log("data", data);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <Fieldset legend="General information" className="w-full">
        <TextInput label="Name" value={data?.name} />
        <TextInput label="Tagline" value={data?.tagline} />
      </Fieldset>
    </div>
  );
}
