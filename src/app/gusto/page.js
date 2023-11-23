"use client";

import { useMemo, useState, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

//nested data is ok, see accessorKeys in ColumnDef below

const Gusto = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://api.punkapi.com/v2/beers");
      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const parsedData = await res.json();
      setData(parsedData);
    };

    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "tagline",
        header: "Tagline",
      },
      {
        accessorKey: "first_brewed",
        header: "First Brewed in",
      },
      {
        accessorKey: "abv",
        header: "ABV",
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data,
  });

  return (
    <main className="p-24">
      <MantineReactTable table={table} />
    </main>
  );
};

export default Gusto;
