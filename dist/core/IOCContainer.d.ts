import { ProviderConfiguration, SingletonRegistry } from "./types";
export declare class IOCContainer {
    private providerConfigurations;
    private singletonsStorage;
    private processValidator;
    private beanFactory;
    addProviderConfiguration(providerConfiguration: ProviderConfiguration): void;
    addAllProviderConfigurations(providerConfigurations: ProviderConfiguration[]): void;
    getAllProviderConfigurations(): ProviderConfiguration[];
    bootSingletons(): void;
    getInstanceByIdentifier(identifier: string, params?: any): any;
    getSingletonStorage(): SingletonRegistry[];
}
