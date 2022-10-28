# DP-Builder API

## Types

 - Component
	 - label? - user given label
	 - type *(gobot, intent catcher, etc.)*
 - Model
	 - 

## Endpoints

 - /components
	 - GET - list all components
	 - POST - create new component
	 - /*{res_id}*
		 - GET - component details
		 - PATCH - modify component property (allowed: label)
		 - DELETE - delete component
		 - /models
			 - GET - list all trained models for this component
			 - POST - start new training
		 - /*{data_type}*
			 - GET - list all data with this type
			 - POST - add new element
			 - /*{res_id}*
				 - PUT - update an element
				 - DELETE - delete an element
 - /deployments
	 - GET - list all deployments
	 - POST - create new deployment
	 - /*{hash}*
		 - GET - status of deployment
		 - DELETE - stop deployment
 - /rev
	 - /*{res_id}*
		 - GET - list all revisions of resource
		 - /*{hash}*
			 - GET - get specific revision of resource

