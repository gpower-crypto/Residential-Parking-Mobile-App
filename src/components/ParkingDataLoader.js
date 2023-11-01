const fetchParkingData = async (skip = 0) => {
  const headersList = {
    Accept: "application/json",
    AccountKey: "57p2WigvTBikeYaf2EOr9g==",
  };

  const parkingData = [];

  try {
    const response = await fetch(
      `http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2?$skip=${skip}`,
      {
        method: "GET",
        headers: headersList,
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data.value && data.value.length == 500) {
      parkingData.push(...data.value);

      // Continue fetching the next batch of data
      const moreData = await fetchParkingData(skip + 500);
      parkingData.push(...moreData);
    } else {
      // Stop calling the API when there's no more data
      console.log("No more data to fetch");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return parkingData;
};

export default fetchParkingData;
