fn supergraph_service(service) {
    service.map_response(|response|{
        response.context["has_errors"] = response.body.errors.len > 0;
    });
}

