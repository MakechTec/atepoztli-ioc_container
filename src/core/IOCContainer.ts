import {ProviderConfiguration, SingletonRegistry} from "./types";
import {SCOPE_APPLICATION, SCOPE_PROTOTYPE} from "./constants";
import {DependencyProcessValidator} from "../validation/DependencyProcessValidator";
import {BeanFactory} from "../factory/BeanFactory";

export class IOCContainer{

    private providerConfigurations: ProviderConfiguration[] = [];
    private singletonsStorage: SingletonRegistry[] = [];
    private processValidator: DependencyProcessValidator = new DependencyProcessValidator();
    private beanFactory: BeanFactory = new BeanFactory();

    public addProviderConfiguration(providerConfiguration: ProviderConfiguration): void{

        this.processValidator.validateUniqueIdentifier(providerConfiguration.providerFeatures.identifier, this.providerConfigurations.map(provider => provider.providerFeatures));

        this.providerConfigurations.push(providerConfiguration);
    }

    public addAllProviderConfigurations(providerConfigurations: ProviderConfiguration[]): void{

        providerConfigurations.map(provider => provider.providerFeatures)
            .map(provider => provider.identifier)
            .forEach(identifier => this.processValidator.validateUniqueIdentifier(identifier, this.providerConfigurations.map(provider => provider.providerFeatures)))

        this.providerConfigurations.push(...providerConfigurations);
    }

    public getAllProviderConfigurations(): ProviderConfiguration[]{
        return this.providerConfigurations;
    }

    public bootSingletons(){

        this.processValidator.validateCyclicDependenciesFor(this.providerConfigurations.map(config => config.providerFeatures));
        this.processValidator.validateAllSatisfiedDependencies(this.providerConfigurations.map(config => config.providerFeatures));

        this.beanFactory.registerSingletons(this.providerConfigurations, this);

    }

    public getInstanceByIdentifier(identifier: string, params?: any): any{
        const possiblySingleton =
            this.singletonsStorage
                .find( singletonRegistry => singletonRegistry.providerFeatures.identifier === identifier );

        if(possiblySingleton !== null && possiblySingleton !== undefined){
            return possiblySingleton.singleton;
        }

        const possiblyProvider =
                this.providerConfigurations
                    .filter( provider => provider.providerFeatures.scope === SCOPE_PROTOTYPE )
                    .find(provider => provider.providerFeatures.identifier === identifier);

        if(possiblyProvider === null || possiblyProvider === undefined){
            throw new Error(`There is not registered ServiceProvider to match identifier: ${identifier}`);
        }

        return possiblyProvider.serviceProvider(this, params);
    }

    public getSingletonStorage(){
        return this.singletonsStorage;
    }

}