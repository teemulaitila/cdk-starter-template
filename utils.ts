import * as cdk from 'aws-cdk-lib'
import * as ssm from 'aws-cdk-lib/aws-ssm'

import type { Stage } from './config'

const isValidEnvironment = (env: string | undefined): env is Stage => {
    return env !== undefined && ['dev', 'prod'].includes(env)
}

export const validateEnvironment = (env: string | undefined) => {
    if (!isValidEnvironment(env)) {
        throw new Error('Invalid stage, provide dev or prod')
    }
    return env
}

/**
 * Exports a string value to SSM and CloudFormation outputs.
 * Name in SSM format (e.g. /base/vpc/id) is converted to a CloudFormation format (e.g. base-vpc-id)
 * @param scope scope e.g. cdk.Stack (usually this)
 * @param name identifier for the value
 * @param value value to store/export
 * @param description description for the SSM parameter
 */
export const exportValue = (scope: cdk.Stack, name: string, value: string, description: string) => {
    let cfnName = name.replace(/\//g, '-')
    if (cfnName.startsWith('-')) {
        cfnName = cfnName.slice(1)
    }
    const constructId = name
        .split('/')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')

    scope.exportValue(value, { name: cfnName })

    new ssm.StringParameter(scope, `${constructId}Parameter`, {
        parameterName: name,
        stringValue: value,
        description: description,
    })
}

export const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export interface Tag {
    [key: string]: string
}

export const getTags = (
    envName: string,
    project: string,
    repo: string
): Tag[] => [
    {
        key: 'Environment',
        value: envName,
    },
    {
        key: 'GithubRepo',
        value: repo,
    },
    {
        key: 'Name',
        value: project,
    },
]
