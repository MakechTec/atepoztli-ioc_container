import { IOCContainer } from "./IOCContainer";
export type ProviderConfiguration = {
    serviceProvider: (container: IOCContainer, params?: any) => any;
    providerFeatures: ProviderFeatures;
};
export type ProviderFeatures = {
    scope: string;
    identifier: string;
    dependencies: string[];
};
export type SingletonRegistry = {
    singleton: any;
    providerFeatures: ProviderFeatures;
};
