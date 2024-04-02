import { ProviderConfiguration } from "../core/types";
import { IOCContainer } from "../core/IOCContainer";
export declare class BeanFactory {
    registerSingletons(providers: ProviderConfiguration[], container: IOCContainer): void;
    hasAllSatifiedDependencies(provider: ProviderConfiguration, alreadyInstanciated: Set<string>): boolean;
}
