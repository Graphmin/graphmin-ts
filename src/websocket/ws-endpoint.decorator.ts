/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-11 00:09
 */

function WsEndpoint(path: string, method: string, params: any) {
	return function(target: any, key: string, descriptor: PropertyDescriptor) {
		/*wss.on('connection', (ws: any) => {
			ws.on(method, async (data: any) => {
				const apiAction = new ApiAction(ws, data);

				const validatedData = await validate(params, data);
				if (validatedData.error) {
					apiAction.sendError(400, validatedData.error);
					return;
				}
				const endpointFunction = descriptor.value;
				await endpointFunction(apiAction, validatedData.value);
			});
		});*/
	};
}
