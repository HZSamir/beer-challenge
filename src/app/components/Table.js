"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table as MantineTable,
  ActionIcon,
  Tooltip,
  Modal,
  Fieldset,
  TextInput,
  Menu,
  Button,
} from "@mantine/core";
import ReactPaginate from "react-paginate";
import {
  IconAdjustments,
  IconSortDescending2,
  IconSortAscending2,
} from "@tabler/icons-react";
import Link from "next/link";

const compareDates = (d1, d2, sortOrder) => {
  let date1 = new Date("01/" + d1).getTime();
  let date2 = new Date("01/" + d2).getTime();

  if (date1 < date2) {
    return sortOrder === "asc" ? 1 : -1;
  } else if (date1 > date2) {
    return sortOrder === "asc" ? -1 : 1;
  } else {
    return 0;
  }
};

const defaultTableData = {
  head: ["Name", "Tagline", "First Brewed", "ABV", "Link"],
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
        <TextInput label="Name" defaultValue={data?.name || ""} />
        <TextInput label="Tagline" defaultValue={data?.tagline || ""} />
      </Fieldset>
    </Modal>
  );
};

const ITEMS_PER_PAGE = 10;

export default function Table() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [opened, setOpened] = useState(false);
  const [beerId, setBeerId] = useState(null);

  // Sorting
  const [sorting, setSorting] = useState({
    name: "asc",
    tagline: "asc",
    first_brewed: "asc",
    abv: "asc",
  });

  // Pagination
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + ITEMS_PER_PAGE;
  const [currentItems, setCurrentItems] = useState([]);
  const pageCount = Math.ceil(data.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentItems(
      data
        .sort((a, b) => {
          const column = Object.keys(sorting).find(
            (key) => sorting[key] !== ""
          );
          if (column === "first_brewed") {
            return compareDates(a[column], b[column], sorting?.first_brewed);
          }

          if (column === "abv") {
            return sorting.abv === "asc"
              ? a[column] - b[column]
              : b[column] - a[column];
          }

          return sorting[column] === "asc"
            ? a[column].localeCompare(b[column])
            : b[column].localeCompare(a[column]);
        })
        .slice(itemOffset, endOffset)
    );
  }, [data, sorting, itemOffset, endOffset]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * ITEMS_PER_PAGE) % data.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  const handleChangeSorting = (column) => {
    setSorting((currVal) => ({
      ...Object.fromEntries(Object.keys(currVal).map((key) => [key, ""])),
      [column]: currVal[column] === "asc" ? "desc" : "asc",
    }));
  };
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
          className="flex flex-row mr-1 items-center justify-between	"
          onClick={() => handleChangeSorting("name")}
        >
          Name
          {sorting.name === "asc" ? (
            <IconSortAscending2
              style={{ width: "22px", height: "22px" }}
              stroke={1.5}
            />
          ) : (
            <IconSortDescending2
              style={{ width: "22px", height: "22px" }}
              stroke={1.5}
            />
          )}
        </div>,
        <div
          key="Tagline"
          className="flex flex-row mr-1 items-center justify-between	"
          onClick={() => handleChangeSorting("tagline")}
        >
          Tagline
          {sorting.tagline === "asc" ? (
            <IconSortAscending2
              style={{ width: "22px", height: "22px" }}
              stroke={1.5}
            />
          ) : (
            <IconSortDescending2
              style={{ width: "22px", height: "22px" }}
              stroke={1.5}
            />
          )}
        </div>,
        <div
          key="first_brewed"
          className="flex flex-row mr-1 items-center justify-between	whitespace-nowrap		"
          onClick={() => handleChangeSorting("first_brewed")}
        >
          First Brewed
          {sorting.first_brewed === "asc" ? (
            <IconSortAscending2
              style={{ width: "22px", height: "22px" }}
              stroke={1.5}
            />
          ) : (
            <IconSortDescending2
              style={{ width: "22px", height: "22px" }}
              stroke={1.5}
            />
          )}
        </div>,
        <div
          key="abv"
          className="flex flex-row mr-1 items-center justify-between	"
          onClick={() => handleChangeSorting("abv")}
        >
          ABV
          {sorting.abv === "asc" ? (
            <IconSortAscending2
              style={{ width: "22px", height: "22px" }}
              stroke={1.5}
            />
          ) : (
            <IconSortDescending2
              style={{ width: "22px", height: "22px" }}
              stroke={1.5}
            />
          )}
        </div>,
        "Link",
      ],
      body: currentItems
        .filter((beer) =>
          beer.name.toLowerCase().includes(search.toLowerCase())
        )
        .map((beer) => [
          <div key={beer.id} className="oneLine">
            {beer.name}
          </div>,
          <div key={beer.id} className="oneLine">
            {beer.tagline}
          </div>,
          <div key={beer.id} className="oneLine">
            {beer.first_brewed}
          </div>,
          <div key={beer.id} className="oneLine">
            {beer.abv}
          </div>,

          <>
            {/* <Tooltip label="Open in dialog">
              <ActionIcon
                variant="filled"
                color="yellow"
                size="lg"
                radius="xl"
                aria-label="Settings"
                onClick={() => {
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
            </Tooltip> */}
            <Menu>
              <Menu.Target>
                <Button>Toggle menu</Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Link key={beer.id} href={`/beer/${beer.id}`}>
                  <Menu.Item>Open in Page</Menu.Item>
                </Link>
                <Menu.Item
                  onClick={() => {
                    setBeerId(beer.id);
                    setOpened(true);
                  }}
                >
                  Open in Dialog
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </>,
        ]),
    };
  }, [
    currentItems,
    data,
    search,
    sorting.first_brewed,
    sorting.name,
    sorting.tagline,
    sorting.abv,
  ]);

  return (
    <div className="w-full">
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
        withRowBorders
      />
      <ReactPaginate
        breakLabel="..."
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        renderOnZeroPageCount={null}
        previousLabel="<"
        nextLabel=">"
        containerClassName="flex justify-center gap-1 text-xs font-medium mt-4"
        pageClassName="block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900"
        previousClassName="block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900"
        nextClassName="block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900"
        activeClassName="block h-8 w-8 rounded !border-blue-600 !bg-blue-600 text-center leading-8 !text-white"
        pageLinkClassName="w-full h-full block"
      />
      <BeerModal opened={opened} onClose={onClose} beerId={beerId} />
    </div>
  );
}
