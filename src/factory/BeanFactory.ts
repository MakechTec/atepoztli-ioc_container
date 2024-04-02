import {ProviderConfiguration, SingletonRegistry} from "../core/types";
import {IOCContainer} from "../core/IOCContainer";
import {SCOPE_APPLICATION} from "../core/constants";

export class BeanFactory{

    public registerSingletons(providers: ProviderConfiguration[], container: IOCContainer){

        const alreadyInstanciated: Set<string> = new Set<string>();
        const notYetInstanciated: Set<string> = new Set<string>();

        const singletonProviders: ProviderConfiguration[] = providers.filter(provider => provider.providerFeatures.scope === SCOPE_APPLICATION);

        singletonProviders.map(provider => notYetInstanciated.add(provider.providerFeatures.identifier));

        while(notYetInstanciated.size > 0){


            for(let provider of singletonProviders.filter( singletonProvider => notYetInstanciated.has(singletonProvider.providerFeatures.identifier) )){
                if(!this.hasAllSatifiedDependencies(provider, alreadyInstanciated)){
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

    public hasAllSatifiedDependencies(provider: ProviderConfiguration, alreadyInstanciated: Set<string>){
        let isSatisfied = true;

        for(let dependency of provider.providerFeatures.dependencies){
            isSatisfied = alreadyInstanciated.has(dependency)
        }

        return isSatisfied;

    }

}