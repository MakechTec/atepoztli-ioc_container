import {ProviderConfiguration} from "../src/core/types";
import {Doggie} from "./mocks/doggie/Doggie";
import {House} from "./mocks/house/House";

export const PROVIDERS: ProviderConfiguration[] = [
    {
        serviceProvider: () => new Doggie(),
        providerFeatures: {
            scope: "application",
            identifier: "doggie",
            dependencies: []
        }
    },
    {
        serviceProvider: (container) => {
            return new House([
                container.getInstanceByIdentifier("doggie")
            ]);
        },
        providerFeatures: {
            scope: "application",
            identifier: "house",
            dependencies: [
                "doggie"
            ]
        }
    }
];