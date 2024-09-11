export type Stage = keyof typeof config

export const config = {
    dev: {},
    prod: {},
} as const
