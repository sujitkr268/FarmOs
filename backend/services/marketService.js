const fetchMandiPrices = async (queryParams = {}) => {
  const apiKey = process.env.DATA_GOV_API_KEY;

  if (!apiKey) {
    throw new Error("DATA_GOV_API_KEY is missing in backend environment configuration.");
  }

  const resourceId = "9ef84268-d588-465a-a308-a864a43d0070";
  const baseUrl = `https://api.data.gov.in/resource/${resourceId}`;

  const url = new URL(baseUrl);
  url.searchParams.append("api-key", apiKey);
  url.searchParams.append("format", "json");

  // Pagination parameters
  const limit = queryParams.limit ? parseInt(queryParams.limit, 10) : 10;
  const offset = queryParams.offset ? parseInt(queryParams.offset, 10) : 0;
  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("offset", offset.toString());

  // Filter mapping for data.gov.in
  if (queryParams.state) {
    url.searchParams.append("filters[state.keyword]", queryParams.state);
  }
  if (queryParams.district) {
    url.searchParams.append("filters[district]", queryParams.district);
  }
  if (queryParams.market) {
    url.searchParams.append("filters[market]", queryParams.market);
  }
  if (queryParams.commodity) {
    url.searchParams.append("filters[commodity]", queryParams.commodity);
  }
  if (queryParams.variety) {
    url.searchParams.append("filters[variety]", queryParams.variety);
  }
  if (queryParams.grade) {
    url.searchParams.append("filters[grade]", queryParams.grade);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Data.gov.in API returned HTTP status ${response.status}`);
  }

  const json = await response.json();

  if (json.status !== "ok" && !json.records) {
    throw new Error(json.message || "Failed to retrieve market prices from data.gov.in");
  }

  const records = (json.records || []).map((rec) => ({
    state: rec.state || "",
    district: rec.district || "",
    market: rec.market || "",
    commodity: rec.commodity || "",
    variety: rec.variety || "",
    grade: rec.grade || "",
    arrival_date: rec.arrival_date || "",
    min_price: rec.min_price !== undefined ? Number(rec.min_price) : 0,
    max_price: rec.max_price !== undefined ? Number(rec.max_price) : 0,
    modal_price: rec.modal_price !== undefined ? Number(rec.modal_price) : 0,
  }));

  return {
    success: true,
    count: records.length,
    total: json.total || records.length,
    limit: limit,
    offset: offset,
    data: records,
  };
};

module.exports = {
  fetchMandiPrices,
};
