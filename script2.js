d3.json("https://gist.githubusercontent.com/emanueles/591172235e5c05c814752b7536155617/raw/8acfbc3b59204a9b7495a9a779012fadca811dce/countries2000.json").then(countries => {

  const latestData = Array.from(
    d3.group(countries, d => d.country),
    ([, values]) => values.sort((a, b) => d3.descending(a.year, b.year))[0]
  );

  latestData.sort((a, b) => d3.ascending(a.life_expect, b.life_expect));

  const margin = { top: 80, right: 30, bottom: 40, left: 100 };
  const width = 800 - margin.left - margin.right;
  const height = 25 * latestData.length;

  const svg = d3.create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Título
  svg.append("text")
    .attr("x", (width + margin.left + margin.right) / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("Expectativa de Vida por País (último ano disponível)");

  // Subtítulo
  svg.append("text")
    .attr("x", (width + margin.left + margin.right) / 2)
    .attr("y", 55)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .style("fill", "#555")
    .text("Fonte: Dataset de países - variável 'life_expect'");

  const x = d3.scaleLinear()
    .domain([0, d3.max(latestData, d => d.life_expect)])
    .range([0, width]);

  const y = d3.scaleBand()
    .domain(latestData.map(d => d.country))
    .range([0, height])
    .padding(0.1);

  g.append("g").call(d3.axisLeft(y));
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  g.selectAll("rect")
    .data(latestData)
    .enter().append("rect")
    .attr("y", d => y(d.country))
    .attr("height", y.bandwidth())
    .attr("x", 0)
    .attr("width", d => x(d.life_expect))
    .attr("fill", "steelblue");

  g.selectAll("text.label")
    .data(latestData)
    .enter().append("text")
    .attr("class", "label")
    .attr("x", d => x(d.life_expect) - 5)
    .attr("y", d => y(d.country) + y.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")
    .style("fill", "white")
    .style("font-size", "11px")
    .text(d => d.life_expect.toFixed(1));

  document.body.appendChild(svg.node());

