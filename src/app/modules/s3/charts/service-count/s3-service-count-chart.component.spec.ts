import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LambdaFunctionInvocationsChartComponent} from "./lambda-function-invocation-count-chart.component";

<<<<<<<< HEAD:src/app/modules/sqs/charts/service-count/service-count-chart.component.spec.ts
import {ServiceTimeChartComponent} from './s3-service-count-chart.component';

describe('HomeComponent', () => {
    let component: ServiceTimeChartComponent;
    let fixture: ComponentFixture<ServiceTimeChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ServiceTimeChartComponent]
========

describe('HomeComponent', () => {
    let component: LambdaFunctionInvocationsChartComponent;
    let fixture: ComponentFixture<LambdaFunctionInvocationsChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LambdaFunctionInvocationsChartComponent]
>>>>>>>> main:src/app/modules/lambda/charts/function-invocation-count/lambda-function-invocation-count-chart.component.spec.ts
        })
            .compileComponents();
    });

    beforeEach(() => {
<<<<<<<< HEAD:src/app/modules/sqs/charts/service-count/service-count-chart.component.spec.ts
        fixture = TestBed.createComponent(ServiceTimeChartComponent);
========
        fixture = TestBed.createComponent(LambdaFunctionInvocationsChartComponent);
>>>>>>>> main:src/app/modules/lambda/charts/function-invocation-count/lambda-function-invocation-count-chart.component.spec.ts
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
