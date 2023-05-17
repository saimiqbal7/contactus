# Contact Us Project

There are a lot of moving pieces in this application so we will break it into steps:

# The front end 

The front end is responsible for getting some data from the user. Once we get the data, we need to encrypt it to the task creator’s public address and host it on one of the task nodes running that task. To achieve this we need the following:
	
Task creator public address to encrypt data
Task nodes ip address to post the data to it

# The task node

The task nodes running the task are responsible for  holding the encrypted payload

# The back end 

The back end will retrieve the encrypted data from the task node, decrypt is using the private key of the task creator and viewing the data
