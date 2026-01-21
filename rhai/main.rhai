fn subgraph_service(service, subgraph) {
    service.map_request(|request|{
        request.context["user_id"] = "xxx";
    });
}
fn supergraph_service(service) {

    service.map_response(|response|{
        response.context["has_errors"] = response.body.errors.len > 0;
    });
}
