/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-12 21:55
 */

export function EventHandler<T>(event: string) {
	return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;
		descriptor.value = function(data: T) {
			//eventEmitter.on(event, (data: T) => originalMethod.apply(this, [data]));
		}
	}
}
