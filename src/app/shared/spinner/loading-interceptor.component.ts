import {Injectable} from "@angular/core";
import {HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {LoadingService} from "./loading-service.component";
import {debounceTime, finalize, Observable} from "rxjs";

export const SkipLoading =
    new HttpContextToken<boolean>(() => false);

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

    constructor(private readonly loadingService: LoadingService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Check for a custom attribute to avoid showing loading spinner
        if (request.context.get(SkipLoading)) {
            // Pass the request directly to the next handler
            return next.handle(request);
        }

        // Turn on the loading spinner
        this.loadingService.loadingOn();
        return next.handle(request)
            .pipe(
                debounceTime(1000),
                finalize(() => {
                    this.loadingService.loadingOff();
                })
            );
    }
}
