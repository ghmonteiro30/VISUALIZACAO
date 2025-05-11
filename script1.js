// Carregar os dados diretamente da URL com d3.json
d3.json("https://gist.githubusercontent.com/emanueles/591172235e5c05c814752b7536155617/raw/8acfbc3b59204a9b7495a9a779012fadca811dce/countries2000.json").then(countries => {

  const latestData = Array.from(
    d3.group(countries, d => d.country),
    ([, values]) => values.sort((a, b) => d3.descending(a.year, b.year))[0]
  );

  const margin = { top: 80, right: 100, bottom: 60, left: 100 };
  const width = 1200 - margin.left - margin.right;
  const height = 700 - margin.top - margin.bottom;

  const svg = d3.create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Título
  svg.append("text")
    .attr("x", (width + margin.left + margin.right) / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    .style("font-weight", "bold")
    .text("Fertilidade vs Expectativa de Vida (último ano disponível)");

  const x = d3.scaleLinear()
    .domain(d3.extent(latestData, d => d.fertility)).nice()
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain(d3.extent(latestData, d => d.life_expect)).nice()
    .range([height, 0]);

  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  g.append("g").call(d3.axisLeft(y));

  svg.append("text")
    .attr("x", margin.left + width / 2)
    .attr("y", height + margin.top + 50)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Taxa de Fertilidade");

  svg.append("text")
    .attr("transform", `rotate(-90)`)
    .attr("y", 20)
    .attr("x", -(margin.top + height / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Expectativa de Vida");

  g.selectAll("circle")
    .data(latestData)
    .enter().append("circle")
    .attr("cx", d => x(d.fertility))
    .attr("cy", d => y(d.life_expect))
    .attr("r", 4)
    .attr("fill", "steelblue")
    .attr("opacity", 0.7);

  g.selectAll("text.country")
    .data(latestData)
    .enter().append("text")
    .attr("x", d => x(d.fertility) + 6)
    .attr("y", d => y(d.life_expect) + 4)
    .attr("font-size", "10px")
    .attr("fill", "#333")
    .text(d => d.country);

  document.getElementById("grafico1").appendChild(svg.node());
});
