import {ProviderFeatures} from "../core/types";

export class DependencyProcessValidator {

    public validateCyclicDependenciesFor(providers: ProviderFeatures[]) {
        const visited: Set<string> = new Set<string>();

        const hasCycle = (identifier: string, visiting: Set<string> = new Set<string>()) => {

            if (visited.has(identifier)) {
                return false; // Already visited this node, no cycle
            }

            if (visiting.has(identifier)) {
                return true; // Cycle detected
            }

            visiting.add(identifier);

            const provider = providers.find(provider => provider.identifier === identifier);

            if (provider === null || provider === undefined) {
                throw new Error(`not found provider with identifier: ${identifier}`);
            }

            for (const depIdentifier of provider.dependencies) {
                if (hasCycle(depIdentifier, visiting)) {
                    return true; // Cycle detected in dependency
                }
            }

            visiting.delete(identifier);
            visited.add(identifier);

            return false; // No cycle
        };


        providers.map(provider => provider.identifier)
            .forEach(identifier => {
                if (hasCycle(identifier)) {
                    throw new Error(`Circular dependency detected for provider with identifier ${identifier}`);
                }
            });
    }

    public validateAllSatisfiedDependencies(providers: ProviderFeatures[]) {
        const allIdentifiers: string[] = providers.map(provider => provider.identifier);

        const dependenciesSet: Set<string> = new Set<string>();

        providers.flatMap(provider => provider.dependencies)
            .forEach(dependency => dependenciesSet.add(dependency));

        dependenciesSet.forEach(dependency => {
            if (!allIdentifiers.includes(dependency)) {
                throw new Error(`Unsatisfied dependency, not found provider for dependency: ${dependency}`);
            }
        });

    }


    public validateUniqueIdentifier(identifier: string, providers: ProviderFeatures[]) {
        if (providers.map(provider => provider.identifier).includes(identifier)) {
            throw new Error(`Already defined identifier ${identifier} must be unique for each provider`);
        }
    }
}