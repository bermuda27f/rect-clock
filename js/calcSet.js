class CalcSet {

    static calcHours_finished(values){
        return (values.getHours() % 12) * 5;
    }
    static calcHours_active (values) {
        return Math.floor((values.getMinutes() / 12));
    }

    static updateTime(time){

        let dayNames =  [
            "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Sonnabend"
        ]

        return {

            seconds : time.getSeconds(),
            minutes : time.getMinutes(),
            hours : time.getHours(),
            day : dayNames[time.getDay()],
            date : time.getDate(),
            month : time.getMonth() + 1,
            year : time.getFullYear(),
            hoursFinished : CalcSet.calcHours_finished(time),
            hoursActive : CalcSet.calcHours_active(time),
    
        }
    }

    static updateGrid(mode, vars, values){
    
        let tmp = []
        let position = values.hoursFinished + values.hoursActive;

            for(let i = 0; i < vars.grid.length; i++){

                let id = vars.grid[i].id;

                let switchCondition = values.hours === 0 || values.hours === 12;
                let activeCondition = (id >= (values.hoursFinished - 1) && id < position )

                let condition = mode === "finished" ? 

                    (id < values.hoursFinished - 1) || (switchCondition ? false : id === 59) :

                    (switchCondition ? (id === 59 || activeCondition) : false) || 
                    activeCondition;

                if(condition){
                    tmp.push(vars.grid[i]);
                }
            }
    
        return tmp

    }
}
