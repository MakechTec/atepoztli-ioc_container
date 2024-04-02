import {Doggie} from "../doggie/Doggie";

export class House{

    public constructor(private doggies: Doggie[]) {}

    public getFunny(){
        this.doggies.forEach( doggie => doggie.run() );
    }
}