class Draw {

    //
    // GRID:
    //

    static drawFrame (svg_ref) {

        d3.select(svg_ref)
            .append("g")
                .attr("transform", `translate(${vars.margin.left}, ${vars.margin.top})`)
                .attr("class", "grid")
                .selectAll("rect")
                .data(vars.grid, d => d.id)
                .enter().append("rect")
                    .attr("id", d => "rect_" + d.id)
                    .attr("x", d => d.x)
                    .attr("y", d => d.y)
                    .attr("width", vars.rectSize - vars.offset)
                    .attr("height", vars.rectSize - vars.offset)
                    .style("stroke", "black")
                    .style("fill", "transparent")
                    .style("stroke-width", "0.5");
    
    }

    //
    // EXTRA
    //

    static drawLines (svg_ref){

        let pathData = () => {
            let tmp = [];
            for(let i = 1 ; i < 5; i++){
                let offsetY = 2 * ((vars.rectSize - vars.offset) + vars.offset);
                tmp.push([{"x" : 0, "y": offsetY * i }, {"x": vars.size, "y" : offsetY * i}]);
            }
            return tmp;
        }

        let data = pathData();

        let path = d3.select(svg_ref)
                .append("g")
                .attr("id", "lines")
                .attr("transform", `translate(${0}, ${vars.margin.top + vars.offset/2})`)

        for(let i = 0 ; i < data.length; i++){
            path.append("path")
                .datum(data[i])
                    .attr("fill", "none")
                    .attr("stroke", "cyan")
                    .attr("stroke-width", 0.75)
                    .attr("d", d3.line()
                        .x(function(d) { return d.x })
                        .y(function(d) { return d.y })
                );
        }
    }

    static drawInfo(svg_ref, time){

        let infoGroup = d3.select(svg_ref)
            .append("g")
                .attr("id", "infoBox")
                    .attr("transform", `translate(${vars.svg_width + 20}, ${vars.svg_height - (1.5 * vars.margin.bottom)})`)
        
        const drawDate = (x, id, offset) => {  
            infoGroup
                .append("text")
                .attr("id", id)
                .attr("y", offset)
                .style("font-size", "15pt")
                .attr("font-family", "sans-serif")
                .text(x)
                .style("text-anchor", "end");
        }
        drawDate(time.date + "." + time.month + "." + time.year, "date", 0)

        drawDate(time.day, "day", 25)
    }

    static updateInfo(svg_ref, time){

        let t = d3.transition().duration(80).delay(20)

        d3.select(svg_ref).select("#infoBox").select("#date")
            .selectAll("text")
            .transition(t)
            .text(time.date + "." + time.month + "." + time.year);

        d3.select(svg_ref).select("#infoBox").select("#day")
            .selectAll("text")
            .transition(t)
            .text(time.day);

    }
    
    //
    // HOURS
    //

    static drawHours(svg_ref, grid, mode) {

        let color = mode === "finished" ? "yellow" : "cyan";

        let container = d3.select(svg_ref);

        container.append("g")
            .attr("id", "hourGrid_" + mode)
            .attr("transform", `translate(${vars.margin.left}, ${vars.margin.top})`)
            .selectAll("rect")
            .data(grid, d => d.id)
            .enter()
                .append("rect")
                    .attr("class", "grid_" + mode )
                    .attr("id", d => "grid_" + d.id )
                    .attr("x", d => d.x)
                    .attr("y", d => d.y)
                    .attr("width", vars.rectSize - vars.offset)
                    .attr("height", vars.rectSize - vars.offset)
                    .style("stroke", "black")
                    .style("fill", color)
                    .style("stroke-width", "0.5");
        
    }

    static updateHours(mode, grid, vars) {

        let t = d3.transition()
            .duration(80)
            .delay(40);

        let color = mode === "finished" ? "yellow" : "cyan";
        let selector = '#hourGrid_' + mode

        const getRects = d3.select(selector)
            .selectAll('rect')
            .data(grid, d => d.id);

        //enter:

        const newRects = getRects
            .enter()
                .append("rect")
                    .attr("class", "grid_" + mode )
                    .attr("id", d => "grid_" + d.id )
                    .style("opacity", 0)
                    .attr("fill", color)
                    .attr("width", vars.rectSize - vars.offset )
                    .attr("height", vars.rectSize - vars.offset )
                    .style("stroke-width", "0.5")
                    .attr("x", d => d.x )
                    .attr("y", d => d.y);

        //update:

        getRects.merge(newRects)
            .transition(t)
                .style("opacity", 1);

        //exit:

        getRects.exit().transition(t).style("opacity",0).remove();

    }

    //
    // NUMBERS:
    //
    
    static drawNumbers(svg_ref, time){

        let daytime = time.hours < 12 ? 0 : 12;

        let container = d3.select(svg_ref).append("g")
            .attr("transform", `translate(${vars.margin.left}, ${vars.margin.top})`)
            .attr("id", "numbers");

        container
            .selectAll("text")
            .data(vars.grid, d=>d.number)
            .enter()
                .filter(x => {return x.number !== undefined})
                .append("text")
                .attr("x", d => d.x + ((vars.rectSize - vars.offset)/2))
                .attr("y", d => d.y + ((vars.rectSize - vars.offset)/2))
                .attr("dy", ".4em")
                .style("font-size", "15pt")
                .attr("font-family", "sans-serif")
                .text((d) =>{return (d.number !== 12 ? d.number + daytime : d.number)})
                .style("text-anchor", "middle");
    }

    static updateNumbers(svg_ref, time){

        let t = d3.transition().duration(80).delay(20)
        let daytime = time.hours < 12 ? 0 : 12

        d3.select(svg_ref).select("#numbers")
            .selectAll("text")
            .transition(t)
            .text((d)=>{ return d.number !== 12 ? d.number + daytime : d.number});
    }

    //
    // SEC / MIN:
    //

    static drawSingleRect(svg_ref, timeUnit, value){

        let obj = vars.grid.find(x => x.id === value)

        let color = timeUnit === "second" ? "red" : "black";
        let container = d3.select(svg_ref);

        let rect = container.append("g")
            .attr("transform", `translate(${vars.margin.left + obj.x}, ${vars.margin.top + obj.y})`)
            .attr("id", timeUnit);

        rect.append("rect")
            .attr("width", vars.rectSize - vars.offset)
            .attr("height", vars.rectSize - vars.offset)
            .style("fill", color)

        if(timeUnit === "minute") {

            rect.append("text")
                .attr("id", timeUnit + "rect")
                .attr("x", ((vars.rectSize - vars.offset)/2))
                .attr("y", ((vars.rectSize - vars.offset)/2))
                .attr("dy", ".4em")
                .text(value === 59 ? 0 : value + 1)
                .style("text-anchor", "middle")
                .style("fill", "white")
                .style("font-size", "15pt")
                .style("font-family", "sans-serif");
        }

    }

    static updateSingleRect(timeUnit, value){

        let obj = vars.grid.find(x => x.id === value);

        let t = timeUnit === "second" ? 
            d3.transition()
                .duration(80)
                .delay(20) :
            d3.transition()
                .duration(0)  

       let rect = d3.select('#' + timeUnit)
            .transition(t)
            .style("opacity", 0)
                .transition(t)
                .attr("transform", `translate(${vars.margin.left + obj.x}, ${vars.margin.top + obj.y})`)
                    .transition(t)
                    .style("opacity", 1);

        if(timeUnit === "minute"){

            rect.select("text")
                .transition(t)
                .text(value === 59 ? 0 : value + 1);
        }

    }
}
