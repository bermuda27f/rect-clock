class Vars {

    constructor(){

        this.size = 500;
        this.marginSet = 12;
        this.margin = {top: this.marginSet, right: this.marginSet, bottom: this.marginSet, left: this.marginSet}
        this.svg_width = this.size - this.margin.left - this.margin.right;
        this.svg_height = this.size - this.margin.top - this.margin.bottom;
        this.x_count = 6;
        this.y_count = 10;
        this.offset = 5; 
        this.rectSize = (this.svg_height/this.y_count) - (this.offset/this.y_count);
        this.grid = this.buildGrid();

    }

    buildGrid(){

        let gridArray = [];
        let counter = -1;
        let numberCount = 0;

        for(let i = 0; i < this.y_count; i++) {
            for(let j = 0; j < this.x_count; j++){
                counter++;
                let result;
                if(((counter + 1) % 5 === 0)){
                    numberCount++;
                    result = (counter + 1) - (4 * numberCount);
                }
                else{
                    result = undefined;
                }
                gridArray.push({ 
                    x : this.offset + (j * this.rectSize), 
                    y : this.offset + (i * this.rectSize),
                    id : counter,
                    number : result
                });

            }
        }
        return gridArray;
    }
}