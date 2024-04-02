### IOC Container ###

A dependency injection engine for vanilla JavaScript projects.

### USAGE ###

1. First create an instance, this should be global.
2. Second create an array of provider configurations:
    
    - the serviceProvider attribute should return a new instance
    - the providerFeatures attribute should define the scope "application" or "prototype"
    - the identifier should be unique among service providers
    - the dependency array should declare another identifiers for service providers used inside same serviceProvider function, only applies for "application" scope
 
3. Third call the addAllProviderConfigurations and pass the array.
4. Call the bootSingletons to create all instances with scope of "application"
5. Finally, you can call the global container and get the right instance in wherever you want just passing the identifier
6. To understand better how scope affects, please see the [__SCOPE__](#scope-) section.
7. To understand the dependency among instances please see the [__DEPENDENCY__](#dependency-) section.

### EXAMPLE ###


    const globalIOCContainer = new IOCContainer();

    const MOCKS: ProviderConfiguration[] = [
        {   
            serviceProvider: (container) => {
                return new House([
                    container.getInstanceByIdentifier("doggie")
                ]);
            },
            providerFeatures: {
                scope: "application",
                identifier: "house",
                dependencies: [
                    "doggie"
                ]
            }
        },
        {
            serviceProvider: () => new Doggie(),
            providerFeatures: {
                scope: "prototype",
                identifier: "doggie",
                dependencies: []
            }
        }
    ];

    globalIOCContainer.addAllProviderConfigurations(MOCKS);

    globalIOCContainer.bootSingletons();

    const instance = globalIOCContainer.getInstanceByIdentifier("doggie");


### SCOPE ###

When you declare a provider function you should return the instance to be stored, also define the scope of this instance, there are two options:

- "application"
- "prototype"

#### APLICATION ###

When you use application scope then serviceProvider function will be called at bootSingletons calling and the result will be stored internally, so
when you call the getInstanceByIndentifier function passing same id, you will get the same instance no matter how many times or wherever you call it.

Also, if you choose application scope the serviceProvider function should not receive parameters because when it'll be called inside bootSingletons, it
won't pass anything.

#### PROTOTYPE ####

In case of you choose prototype scope that means one instance will be created each time you call the getInstanceByIdentifier function, also you can pass
optionally one additional object with whatever you want, so in this case the serviceProvider function can receive this param object and use.

Another interesting question is, when called bootSingletons this instances won't be stored, instead you will get a fresh instance when you call the 
getInstanceByIdentifier.

___

### DEPENDENCY ###

Another important think to know is what happens if I need another singleton for my singleton?, let's see:

Inside your serviceProvider function you will get available the container instance as first parameter, so you can call the singleton instance you need
just passing the corresponding identifier to the getInsanceByIdentifier function. 
The question is you should not pass additional parameters because is a singleton, so is already created.

In case you need a prototype instance inside serviceProvider function, you can also call the getInsanceByIdentifier and pass the extra param object normally.

#### DECLARATION ####

When you declare in the providerFeatures attribute the list of dependencies, you'll only put the singleton dependencies and only if the scope is also "application",
so if your service provider is scope "prototype" you don't have to set the dependency list.

Let's suppose you have a serviceProvider of scope "application" and you have three dependencies, one is for another serviceProvider of scope "application", but
the rest are of scope prototype, so you will declare in your dependency list just the one.

