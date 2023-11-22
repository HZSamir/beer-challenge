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
import {
  IconAdjustments,
  IconArrowsTransferDown,
  IconArrowsTransferUp,
} from "@tabler/icons-react";
import Link from "next/link";

const defaultTableData = {
  caption: "Beer Info",
  head: ["Name", "Tagline", "First Brewed", "abv", "Link"],
  body: [],
};

const BeerModal = ({ opened, onClose, beerId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!beerId) return;

    const fetchData = async () => {
      const res = await fetch(`https://api.punkapi.com/v2/beers/${beerId}`);
      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const parsedData = await res.json();
      setData(parsedData[0]);
    };

    fetchData();
  }, [beerId]);

  useEffect(() => {
    if (!opened) setData(null);
  }, [opened]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Beer Information"
      size="xl"
      padding="xl"
    >
      <Fieldset legend="General information">
        <TextInput label="Name" value={data?.name} />
        <TextInput label="Tagline" value={data?.tagline} />
      </Fieldset>
    </Modal>
  );
};

export default function Table() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [opened, setOpened] = useState(false);
  const [beerId, setBeerId] = useState(null);

  const [sorting, setSorting] = useState({
    name: "asc",
    tagline: "asc",
    first_brewed: "asc",
    abv: "asc",
  });

  const handleChangeSorting = (value) => {
    setSorting((currVal) => ({
      ...currVal,
      [value]: currVal[value] === "asc" ? "desc" : "asc",
    }));
  };

  console.log("current value", sorting.name);
  const onClose = () => setOpened(false);

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

  const tableData = useMemo(() => {
    if (!data || data.length === 0) return defaultTableData;

    return {
      ...defaultTableData,

      head: [
        <div
          key="name"
          className="flex flex-row"
          onClick={() => {
            console.log("changing name sort");
            handleChangeSorting("name");
          }}
        >
          Name{" "}
          {sorting.name === "asc" ? (
            <IconArrowsTransferUp
              style={{ width: "14px", height: "14px" }}
              stroke={1.5}
            />
          ) : (
            <IconArrowsTransferDown
              style={{ width: "14px", height: "14px" }}
              stroke={1.5}
            />
          )}
        </div>,
        "Tagline",
        "First Brewed",
        "abv",
        "Link",
      ],
      body: data
        .filter((beer) =>
          beer.name.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) =>
          sorting.name === "asc"
            ? a.name.localeCompare(b.name)
            : !a.name.localeCompare(b.name)
        )
        .map((beer) => [
          beer.name,
          beer.tagline,
          beer.first_brewed,
          beer.abv,

          <>
            <Tooltip label="Open in dialog">
              <ActionIcon
                variant="filled"
                color="yellow"
                size="lg"
                radius="xl"
                aria-label="Settings"
                onClick={() => {
                  console.log("beer id", beer.id);
                  setBeerId(beer.id);
                  setOpened(true);
                }}
              >
                <IconAdjustments
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Open in page">
              <Link key={beer.id} href={`/beer/${beer.id}`}>
                <ActionIcon
                  variant="filled"
                  color="yellow"
                  size="lg"
                  radius="xl"
                  aria-label="Settings"
                >
                  <IconAdjustments
                    style={{ width: "70%", height: "70%" }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Link>
            </Tooltip>
          </>,
        ]),
    };
  }, [data, search, sorting]);

  return (
    <div>
      <input
        value={search}
        onChange={() => setSearch(event.target.value)}
        placeholder="Search here..."
      />
      <MantineTable
        data={tableData}
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
        stickyHeader
        stickyHeaderOffset={60}
      />

      <BeerModal opened={opened} onClose={onClose} beerId={beerId} />
    </div>
  );
}
