"use client";

import {
  Group,
  Fieldset,
  Input,
  TextInput,
  List,
  Title,
  LoadingOverlay,
} from "@mantine/core";
import {
  Bottle,
  ChartInfographic,
  Flask,
  TargetArrow,
} from "tabler-icons-react";
import { useEffect, useState } from "react";

export default function Page({ params }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`https://api.punkapi.com/v2/beers/${params.id}`);
      if (!res.ok) {
        setLoading(false);
        throw new Error("Something went wrong");
      }

      setLoading(false);
      const parsedData = await res.json();
      setData(parsedData[0]);
    };

    fetchData();
  }, [params.id]);

  const boilVolume = `${String(data?.boil_volume?.value) || ""} ${
    data?.boil_volume?.unit || ""
  }`;
  console.log("boilVolume:", boilVolume);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Fieldset
        legend="Beer information"
        className="w-full"
        variant="filled"
        disabled
      >
        <TextInput
          variant="filled"
          label="Name"
          defaultValue={data?.name || ""}
        />
        <TextInput
          variant="filled"
          label="Tagline"
          defaultValue={data?.tagline || ""}
        />
        <TextInput
          variant="filled"
          label="Description"
          defaultValue={data?.description || ""}
        />
        <TextInput
          variant="filled"
          label="First Brewed"
          defaultValue={data?.first_brewed || ""}
        />
        <TextInput
          variant="filled"
          label="Brewer Tip"
          defaultValue={data?.brewers_tips || ""}
        />
        <Group justify="flex-start">
          <Input.Wrapper label="ABV">
            <Input
              defaultValue={data?.abv || ""}
              leftSection={<Bottle size={16} />}
            />
          </Input.Wrapper>
          <Input.Wrapper label="Attenuation Level">
            <Input
              defaultValue={data?.attenuation_level || ""}
              leftSection={<ChartInfographic size={16} />}
            />
          </Input.Wrapper>
          <Input.Wrapper label="Boil Volume">
            <Input
              value={boilVolume}
              onChange={(event) => console.log(event.target.value)}
              disabled
              leftSection={<Flask size={16} />}
            />
          </Input.Wrapper>
          <Input.Wrapper label="EBC">
            <Input
              defaultValue={data?.ebc || ""}
              leftSection={<TargetArrow size={16} />}
            />
          </Input.Wrapper>
        </Group>
        <Group justify="flex-start">
          <Input.Wrapper label="IBU">
            <Input
              defaultValue={data?.ibu || ""}
              leftSection={<Bottle size={16} />}
            />
          </Input.Wrapper>
          <Input.Wrapper label="PH">
            <Input
              defaultValue={data?.ph || ""}
              leftSection={<Bottle size={16} />}
            />
          </Input.Wrapper>
          <Input.Wrapper label="SRM">
            <Input
              defaultValue={data?.srm || ""}
              leftSection={<Flask size={16} />}
            />
          </Input.Wrapper>
        </Group>
        <Title size="h2">Food Pairing:</Title>
        {data && (
          <List size="sm" withPadding>
            {data?.food_pairing.map((item, index) => (
              <List.Item key={index}>{item}</List.Item>
            ))}
          </List>
        )}
      </Fieldset>
    </div>
  );
}
