
export class Doggie{

    public constructor(private name: string = "") {
    }
    public run(){
        console.log(`I run as doggie named: ${this.name}`);
    }

    public getName(){
        return this.name;
    }
}