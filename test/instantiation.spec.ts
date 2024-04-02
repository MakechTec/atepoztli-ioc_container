import {IOCContainer} from "../src/core/IOCContainer";
import {ProviderConfiguration} from "../src/core/types";
import {Doggie} from "./mocks/doggie/Doggie";
import {House} from "./mocks/house/House";

test('first test', async () => {
    expect(4).toBe(4);
});

test('singleton instantiation', async () => {

    const globalIOCContainer = new IOCContainer();

    const MOCKS: ProviderConfiguration[] = [
        {
            serviceProvider: () => new Doggie(),
            providerFeatures: {
                scope: "application",
                identifier: "doggie",
                dependencies: []
            }
        }
    ];

    globalIOCContainer.addAllProviderConfigurations(MOCKS);

    globalIOCContainer.bootSingletons();

    const sizeOfStorage = globalIOCContainer.getSingletonStorage().length;

    expect(sizeOfStorage).toBe(1);
});

test('prototype instantiation', async () => {

    const globalIOCContainer = new IOCContainer();

    const MOCKS: ProviderConfiguration[] = [
        {
            serviceProvider: () => new Doggie(),
            providerFeatures: {
                scope: "prototype",
                identifier: "doggie",
                dependencies: []
            }
        }
    ];

    globalIOCContainer.addAllProviderConfigurations(MOCKS);

    globalIOCContainer.bootSingletons();

    const sizeOfStorage = globalIOCContainer.getSingletonStorage().length;

    expect(sizeOfStorage).toBe(0);
});

test('singleton instantiation with 1 nested dependency', async () => {

    const globalIOCContainer = new IOCContainer();

    const MOCKS: ProviderConfiguration[] = [
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
        },
        {
            serviceProvider: () => new Doggie(),
            providerFeatures: {
                scope: "application",
                identifier: "doggie",
                dependencies: []
            }
        }
    ];

    globalIOCContainer.addAllProviderConfigurations(MOCKS);

    globalIOCContainer.bootSingletons();

    const sizeOfStorage = globalIOCContainer.getSingletonStorage().length;

    expect(sizeOfStorage).toBe(2);
});

test('call to singleton instance', async () => {

    const globalIOCContainer = new IOCContainer();

    const MOCKS: ProviderConfiguration[] = [
        {
            serviceProvider: () => new Doggie(),
            providerFeatures: {
                scope: "application",
                identifier: "doggie",
                dependencies: []
            }
        }
    ];

    globalIOCContainer.addAllProviderConfigurations(MOCKS);

    globalIOCContainer.bootSingletons();

    globalIOCContainer.getInstanceByIdentifier("doggie");

    const sizeOfStorage = globalIOCContainer.getSingletonStorage().length;

    expect(sizeOfStorage).toBe(1);
});


test('call to prototype instance', async () => {

    const globalIOCContainer = new IOCContainer();

    const MOCKS: ProviderConfiguration[] = [
        {
            serviceProvider: () => new Doggie(),
            providerFeatures: {
                scope: "prototype",
                identifier: "doggie",
                dependencies: []
            }
        }
    ];

    globalIOCContainer.addAllProviderConfigurations(MOCKS);

    globalIOCContainer.bootSingletons();

    const instance = globalIOCContainer.getInstanceByIdentifier("doggie");

    const sizeOfStorage = globalIOCContainer.getSingletonStorage().length;

    expect(sizeOfStorage).toBe(0);
    expect(instance).not.toBeNull();
});


test('call to prototype instance with some parameters', async () => {

    const globalIOCContainer = new IOCContainer();

    const MOCKS: ProviderConfiguration[] = [
        {
            serviceProvider: (container, {name}:{name:string}) => new Doggie(name),
            providerFeatures: {
                scope: "prototype",
                identifier: "doggie",
                dependencies: []
            }
        }
    ];

    globalIOCContainer.addAllProviderConfigurations(MOCKS);

    globalIOCContainer.bootSingletons();

    const instance: Doggie = globalIOCContainer.getInstanceByIdentifier("doggie", {name: "ray"});

    const sizeOfStorage = globalIOCContainer.getSingletonStorage().length;

    expect(sizeOfStorage).toBe(0);
    expect(instance).not.toBeNull();

    const doggieName = instance.getName();

    expect(doggieName).toBe("ray");
});
