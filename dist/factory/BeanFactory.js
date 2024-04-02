"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeanFactory = void 0;
const constants_1 = require("../core/constants");
class BeanFactory {
    registerSingletons(providers, container) {
        const alreadyInstanciated = new Set();
        const notYetInstanciated = new Set();
        const singletonProviders = providers.filter(provider => provider.providerFeatures.scope === constants_1.SCOPE_APPLICATION);
        singletonProviders.map(provider => notYetInstanciated.add(provider.providerFeatures.identifier));
        while (notYetInstanciated.size > 0) {
            for (let provider of singletonProviders.filter(singletonProvider => notYetInstanciated.has(singletonProvider.providerFeatures.identifier))) {
                if (!this.hasAllSatifiedDependencies(provider, alreadyInstanciated)) {
                    continue;
                }
                const singleton = provider.serviceProvider(container);
                container.getSingletonStorage()
                    .push({ singleton: singleton, providerFeatures: provider.providerFeatures });
                alreadyInstanciated.add(provider.providerFeatures.identifier);
                notYetInstanciated.delete(provider.providerFeatures.identifier);
            }
        }
    }
    hasAllSatifiedDependencies(provider, alreadyInstanciated) {
        let isSatisfied = true;
        for (let dependency of provider.providerFeatures.dependencies) {
            isSatisfied = alreadyInstanciated.has(dependency);
        }
        return isSatisfied;
    }
}
exports.BeanFactory = BeanFactory;
