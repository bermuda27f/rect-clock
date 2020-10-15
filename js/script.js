let vars = new Vars();
let interval;

startAnimation();

function startAnimation(){

    let timer = CalcSet.updateTime(new Date(), vars);
    let finishedGrid = CalcSet.updateGrid("finished", vars, timer);
    let activeGrid = CalcSet.updateGrid("active", vars, timer);
    let selector = "#clockCanvas";

    //Draw.drawLines(selector);
    Draw.drawHours(selector, finishedGrid, "finished", vars);
    Draw.drawHours(selector, activeGrid, "active", vars);
    Draw.drawNumbers(selector, timer);
    Draw.drawSingleRect(selector, "minute", timer.minutes === 0 ? 59 : (timer.minutes - 1));
    Draw.drawSingleRect(selector, "second", timer.seconds);
    Draw.drawFrame(selector, timer);
    Draw.drawInfo(selector, timer);

    interval = setInterval(()=>{tick()}, 1000);

}

function tick () {

    let time = new Date();

    let updateTime = CalcSet.updateTime(time, vars);
    let finishedGrid = CalcSet.updateGrid("finished", vars, updateTime);
    let activeGrid = CalcSet.updateGrid("active", vars, updateTime);

    Draw.updateSingleRect("minute", updateTime.minutes === 0 ? 59 : (updateTime.minutes - 1));
    Draw.updateSingleRect("second", updateTime.seconds === 0 ? 59 : (updateTime.seconds - 1));
    Draw.updateHours("finished", finishedGrid, vars);
    Draw.updateHours("active", activeGrid, vars);
    Draw.updateNumbers("#clockCanvas", updateTime);
    Draw.updateInfo("#clockCanvas", updateTime);

}

document.addEventListener('visibilitychange', function() {

    if(document.visibilityState === "hidden") {
        d3.select("#clockCanvas").selectAll("*").remove();
        clearInterval(interval);
    }
    else{
        startAnimation();
    }
});
