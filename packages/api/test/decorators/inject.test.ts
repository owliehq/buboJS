import { app, Controller, Inject, ObjectType, Service } from '../../src'
import { MetadataManager } from '../../src/MetadataManager'

beforeAll(() => {
  app.initApiModule()
})

describe('inject decorator', () => {
  const SERVICE_NAME = 'BasicServiceInjected'
  const SERVICE_NAME_PROPERTY = 'basicServiceInjected'
  const ANOTHER_SERVICE_NAME = 'AnotherBasicServiceInjected'
  const ANOTHER_SERVICE_NAME_PROPERTY = 'anotherBasicServiceInjected'
  const CLASS_NAME = 'ClassBasicInjectedTest'

  @Service()
  class BasicServiceInjected {
    public sum(a: number, b: number) {
      return a + b
    }
  }

  @Service()
  class AnotherBasicServiceInjected {
    public sub(a: number, b: number) {
      return a - b
    }
  }

  @Controller('classBasicInjectedTests')
  class ClassBasicInjectedTest {
    @Inject('BasicServiceInjected') public basicServiceInjected: ObjectType<BasicServiceInjected>
    @Inject public anotherBasicServiceInjected: AnotherBasicServiceInjected

    constructor() {}

    public getSum(a: number, b: number) {
      return this.basicServiceInjected.sum(a, b)
    }
  }

  it('should save basic service inject', () => {
    const injectMetadata = MetadataManager.getInjectionMetadata(CLASS_NAME, SERVICE_NAME_PROPERTY)
    expect(injectMetadata).toBeTruthy()
  })

  it('should save another basic service inject', () => {
    const injectMetadata = MetadataManager.getInjectionMetadata(CLASS_NAME, ANOTHER_SERVICE_NAME_PROPERTY)
    expect(injectMetadata).toBeTruthy()
  })

  it('should instantiate service inside basic class', () => {
    const basicClass = MetadataManager.getControllerMetadata(CLASS_NAME).instance

    expect(basicClass).toBeTruthy()
    expect(basicClass.basicServiceInjected).toBeTruthy()
    expect(basicClass.basicServiceInjected.sum(1, 2)).toBe(3)
  })

  it('should instantiate another service inside basic class', () => {
    const basicClass = MetadataManager.getControllerMetadata(CLASS_NAME).instance

    expect(basicClass).toBeTruthy()
    expect(basicClass.anotherBasicServiceInjected).toBeTruthy()
    expect(basicClass.anotherBasicServiceInjected.sub(3, 1)).toBe(2)
  })
})

describe('circular injection on inject decorator', () => {
  const SERVICE_A = 'ServiceA'
  const SERVICE_B = 'ServiceB'
  @Service()
  class ServiceA {
    public value = 1
    @Inject('ServiceB') public serviceB: ObjectType<ServiceB>

    public sumWithB() {
      return this.value + this.serviceB.value
    }
  }

  @Service()
  class ServiceB {
    public value = 2
    @Inject('ServiceA') serviceA: ObjectType<ServiceA>

    public sumWithA() {
      return this.value + this.serviceA.value
    }
  }

  it('should save service A', () => {
    const serviceMetadata = MetadataManager.getServiceMetadata(SERVICE_A)
    expect(serviceMetadata).toBeTruthy()
  })

  it('should save service B', () => {
    const serviceMetadata = MetadataManager.getServiceMetadata(SERVICE_B)
    expect(serviceMetadata).toBeTruthy()
  })

  it('should instantiate service B inside service A', () => {
    const serviceA = MetadataManager.getServiceMetadata(SERVICE_A)
    expect(serviceA).toBeTruthy()
    expect(serviceA.serviceB).toBeTruthy()
    expect(serviceA.sumWithB()).toBe(3)
  })

  it('should instantiate service A inside service B', () => {
    const serviceB = MetadataManager.getServiceMetadata(SERVICE_B)
    expect(serviceB).toBeTruthy()
    expect(serviceB.serviceA).toBeTruthy()
    expect(serviceB.sumWithA()).toBe(3)
  })
})
