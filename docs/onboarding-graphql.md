  
## New User Workflow
  
1. First Register.

Note the returned token is not for authentication, but for manual account verification
  
```graphql  
mutation register {  
  account {  
    register(input:{  
        firstname: "Alice"  
        lastname: "Bob"  
        email: "AliceBobsEmail@protonmail.com"  
        password: "supersecretpassword"  
    }) {  
      token  
    }  
  }  
}  
``` 

2. Verify activation link using the token returned in register.
  
```graphql  
mutation {
  account {
    verifyActivationLink(token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1aWN5Y2xlZmZAZ21haWwuY29tIiwicGluY29kZSI6IjgwMDY1NCIsImlhdCI6MTU5NjgzNzU5MCwiZXhwIjoxNTk2ODQxMTkwfQ.jIyQPgTtaPa3Am5a20dqQcd8Ng2H_xuxGpaI3-G4rz4") {
      email
      pincode
    }
  }
}
``` 

3. Verify account using the result from verification mutation.
  
```graphql  
mutation {
  account {
    verifyAccount(
        email: "AliceBobsEmail@protonmail.com"
        pincode: "800654"
    ) {
      success
    }
  }
}
``` 

4. Login as a user

Note: this uses session cookie as such you do not need to set any auth header.
  
```graphql  
mutation {
  account {
    login(input: {
      service: Password,
      params: {
      email: "juicycleff@gmail.com"
      password: "@Boldbone12"
      }
    }) {
      id
    }
  }
}
``` 

5. Create Billing Card

Note: This is required to create a tenant.
  
```graphql  
mutation {
  card {
    create(input: {
      name: "Rex Tru",
      cvc: "457",
      number: "4242424242424242",
      expYear: 2021,
      expMonth: 12,
      address: {
        country: "Nigerian",
        state: "Lagos",
        city: "Ikeja",
        postalCode: "10002",
        line: "23 lup road",
      }
    }) {
      id
    }
  }
}
``` 

6. Create Tenant

Note: This is required to create a tenant.
  
```graphql  
mutation {
  tenant {
    create(input: {
      name: "Firt Tenant",
      planId: "plan-free-basic",
    }) {
      id
      normalizedName
    }
  }
}
``` 

And you have your first tenant and you can repeat this as much as you want.

#### Optional

1. Create access token

Note: This is useful if you want client access to a tenant api
  
```graphql  
mutation {
  accessToken {
    create(input: {
      name: "nice token",
      scopes: ["read_webhook", "create_webhook", "read_project"]
    }) {
      id
      token
    }
  }
}
``` 

1. Create webhook

Note: Might come in handy
  
```graphql  
mutation {
  webhook {
    create(input: {
      name: "Second Webhook",
      endpoint: "http://localhost:4000/",
      action: ALL,
      requestType: GET,
      auth: {
        none: {
          type: NONE
        }
      }
    }) {
      id
    }
  }
}
``` 

And you have your first tenant and you can repeat this as much as you want.
