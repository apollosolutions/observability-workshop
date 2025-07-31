#!/usr/bin/env python3
"""
Apollo Router Coprocessor - Logging Example
Simple HTTP server that logs all incoming coprocessor requests from the Apollo Router.
"""

import json
import logging
import random
from datetime import datetime
from flask import Flask, request, jsonify

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/', methods=['POST'])
def coprocessor_endpoint():
    """
    Main coprocessor endpoint that receives requests from Apollo Router.
    Logs the payload and returns a response to continue processing.
    """
    try:
        # Get the incoming payload
        payload = request.get_json() if request.is_json else {}
        
        # Log basic request info
        logger.info("=" * 60)
        logger.info(f"Coprocessor Request Received at {datetime.now().isoformat()}")
        logger.info(f"Headers: {dict(request.headers)}")
        
        # Log the stage information if available
        if 'stage' in payload:
            logger.info(f"Stage: {payload['stage']}")
        
        if 'control_flow' in payload:
            logger.info(f"Control Flow: {payload['control_flow']}")
            
        # Log request details
        if 'request' in payload:
            req = payload['request']
            logger.info(f"Request Method: {req.get('method', 'Unknown')}")
            logger.info(f"Request URI: {req.get('uri', 'Unknown')}")
            if 'headers' in req:
                logger.info(f"Request Headers: {json.dumps(req['headers'], indent=2)}")
        
        # Log response details if present
        if 'response' in payload:
            resp = payload['response']
            logger.info(f"Response Status: {resp.get('status', 'Unknown')}")
            if 'headers' in resp:
                logger.info(f"Response Headers: {json.dumps(resp['headers'], indent=2)}")
        
        # Log subgraph info if present
        if 'subgraph' in payload:
            subgraph = payload['subgraph']
            logger.info(f"Subgraph Name: {subgraph.get('name', 'Unknown')}")
            logger.info(f"Subgraph URI: {subgraph.get('uri', 'Unknown')}")
        
        # Log the full payload (pretty printed)
        logger.info("Full Payload:")
        logger.info(json.dumps(payload, indent=2))
        logger.info("=" * 60)
        
        # Randomly return an error 50% of the time
        should_error = random.random() < 0.5
        
        if should_error:
            logger.warning("🚨 SIMULATING ERROR - Returning error response (50% chance)")
            error_response = {
                "version": 1,
                "stage": payload.get("stage", "unknown"),
                "control": "break",  # Terminate the request
                "body": json.dumps({
                    "errors": [{
                        "message": "Coprocessor simulated error for testing",
                        "extensions": {
                            "code": "COPROCESSOR_ERROR",
                            "timestamp": datetime.now().isoformat()
                        }
                    }]
                }),
                "headers": {
                    "content-type": ["application/json"]
                }
            }
            return jsonify(error_response), 200
        else:
            logger.info("✅ ALLOWING REQUEST - Returning continue response")
            # Return a response that allows the router to continue
            response = {
                "version": 1,
                "stage": payload.get("stage", "unknown"),
                "control": "continue"  # Allow the request to continue
            }
            return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"💥 UNEXPECTED ERROR - Error processing coprocessor request: {str(e)}")
        
        # Return an error response that breaks the request due to unexpected error
        error_response = {
            "version": 1,
            "stage": "unknown",
            "control": "break",
            "body": json.dumps({
                "errors": [{
                    "message": f"Coprocessor internal error: {str(e)}",
                    "extensions": {
                        "code": "COPROCESSOR_INTERNAL_ERROR",
                        "timestamp": datetime.now().isoformat()
                    }
                }]
            }),
            "headers": {
                "content-type": ["application/json"]
            }
        }
        return jsonify(error_response), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()}), 200

if __name__ == '__main__':
    logger.info("Starting Apollo Router Coprocessor...")
    logger.info("Listening on http://localhost:8081")
    logger.info("Press Ctrl+C to stop")
    
    app.run(
        host='0.0.0.0',
        port=8081,
        debug=True,
        use_reloader=False  # Disable reloader to avoid double startup messages
    )