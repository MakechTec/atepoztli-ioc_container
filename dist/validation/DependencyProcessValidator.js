"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyProcessValidator = void 0;
class DependencyProcessValidator {
    validateCyclicDependenciesFor(providers) {
        const visited = new Set();
        const hasCycle = (identifier, visiting = new Set()) => {
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
    validateAllSatisfiedDependencies(providers) {
        const allIdentifiers = providers.map(provider => provider.identifier);
        const dependenciesSet = new Set();
        providers.flatMap(provider => provider.dependencies)
            .forEach(dependency => dependenciesSet.add(dependency));
        dependenciesSet.forEach(dependency => {
            if (!allIdentifiers.includes(dependency)) {
                throw new Error(`Unsatisfied dependency, not found provider for dependency: ${dependency}`);
            }
        });
    }
    validateUniqueIdentifier(identifier, providers) {
        if (providers.map(provider => provider.identifier).includes(identifier)) {
            throw new Error(`Already defined identifier ${identifier} must be unique for each provider`);
        }
    }
}
exports.DependencyProcessValidator = DependencyProcessValidator;
