import { ProviderFeatures } from "../core/types";
export declare class DependencyProcessValidator {
    validateCyclicDependenciesFor(providers: ProviderFeatures[]): void;
    validateAllSatisfiedDependencies(providers: ProviderFeatures[]): void;
    validateUniqueIdentifier(identifier: string, providers: ProviderFeatures[]): void;
}
