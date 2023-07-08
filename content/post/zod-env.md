---
title: "Creating types for process.env with Zod"
date: 2023-07-08
tags: [typescript, zod, processEnv]
authors:
    - Nemanja
---

In this blog post, we will explore how to use [Zod](https://zod.dev), a powerful TypeScript-first schema validation library, 
to create globally defined TypeScript types for environment variables in a project.
Let's get straight to the code.

*environment.d.ts*
```js
import { z } from "zod";

const environmentVariables = z.object({
	OPENAI_API_KEY: z.string(),
	NEXT_PUBLIC_SUPABASE_URL: z.string(),
	SUPABASE_SERVICE_ROLE_KEY: z.string(),
});

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof environmentVariables> {}
	}
}
```


First we define **environmentVariables**, a Zod schema. This schema specifies the shape and validation rules for a set of environment variables
that your application requires. In this case each of these variables is expected to be of type **string**.

The next part of the code introduces a global declaration.
Here's a breakdown of the code:

*declare global*: This is a TypeScript declaration that allows us to modify or extend global types.

*namespace NodeJS*: The NodeJS namespace provides a way to declare types specifically for Node.js environments.

*interface ProcessEnv extends z.infer<typeof environmentVariables> {}*: This line extends the ProcessEnv interface and sets it to 
inherit the inferred type from typeof environmentVariables.

Important part here is that by extending the **ProcessEnv** interface with **z.infer<typeof environmentVariables>**, 
we are essentially stating that the environment variables should conform to the structure and validation rules specified in the
**environmentVariables** Zod schema.
And this will provide type safety and validation when accessing environment variables throughout the project.
