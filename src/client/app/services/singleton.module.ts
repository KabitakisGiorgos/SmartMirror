import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { AssistantService } from './assistant.service';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [CommonModule],
    declarations: [],
    exports: [],
    providers: [AssistantService]
})


export class SingletonModule {
    constructor(@Optional() @SkipSelf() parentModule: SingletonModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(config: SingletonModule): ModuleWithProviders {
        return {
            ngModule: SingletonModule,
            providers: [
                { provide: SingletonModule, useValue: config }
            ]
        };
    }
}