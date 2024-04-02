"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOCContainer = void 0;
const constants_1 = require("./constants");
const DependencyProcessValidator_1 = require("../validation/DependencyProcessValidator");
const BeanFactory_1 = require("../factory/BeanFactory");
class IOCContainer {
    constructor() {
        this.providerConfigurations = [];
        this.singletonsStorage = [];
        this.processValidator = new DependencyProcessValidator_1.DependencyProcessValidator();
        this.beanFactory = new BeanFactory_1.BeanFactory();
    }
    addProviderConfiguration(providerConfiguration) {
        this.processValidator.validateUniqueIdentifier(providerConfiguration.providerFeatures.identifier, this.providerConfigurations.map(provider => provider.providerFeatures));
        this.providerConfigurations.push(providerConfiguration);
    }
    addAllProviderConfigurations(providerConfigurations) {
        providerConfigurations.map(provider => provider.providerFeatures)
            .map(provider => provider.identifier)
            .forEach(identifier => this.processValidator.validateUniqueIdentifier(identifier, this.providerConfigurations.map(provider => provider.providerFeatures)));
        this.providerConfigurations.push(...providerConfigurations);
    }
    getAllProviderConfigurations() {
        return this.providerConfigurations;
    }
    bootSingletons() {
        this.processValidator.validateCyclicDependenciesFor(this.providerConfigurations.map(config => config.providerFeatures));
        this.processValidator.validateAllSatisfiedDependencies(this.providerConfigurations.map(config => config.providerFeatures));
        this.beanFactory.registerSingletons(this.providerConfigurations, this);
    }
    getInstanceByIdentifier(identifier, params) {
        const possiblySingleton = this.singletonsStorage
            .find(singletonRegistry => singletonRegistry.providerFeatures.identifier === identifier);
        if (possiblySingleton !== null && possiblySingleton !== undefined) {
            return possiblySingleton.singleton;
        }
        const possiblyProvider = this.providerConfigurations
            .filter(provider => provider.providerFeatures.scope === constants_1.SCOPE_PROTOTYPE)
            .find(provider => provider.providerFeatures.identifier === identifier);
        if (possiblyProvider === null || possiblyProvider === undefined) {
            throw new Error(`There is not registered ServiceProvider to match identifier: ${identifier}`);
        }
        return possiblyProvider.serviceProvider(this, params);
    }
    getSingletonStorage() {
        return this.singletonsStorage;
    }
}
exports.IOCContainer = IOCContainer;
