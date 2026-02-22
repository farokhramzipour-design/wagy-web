export const API_ENDPOINTS = {
  auth: {
    otpRequest: "/api/v1/auth/otp/request",
    otpVerify: "/api/v1/auth/otp/verify",
    logout: "/api/v1/auth/logout",
    refresh: "/api/v1/auth/refresh",
    me: "/api/v1/auth/me",
    meAdmin: "/api/v1/auth/me/admin",
    googleLogin: "/api/v1/auth/google/login",
    googleCallback: "/api/v1/auth/google/callback"
  },
  admin: {
    users: "/api/v1/admin/users",
    bootstrap: "/api/v1/admin/bootstrap",
    userRole: "/api/v1/admin/users/{user_id}/role",
    userAccess: "/api/v1/admin/users/{user_id}/access",
    rolePermissions: "/api/v1/admin/roles/permissions",
    rolePermissionByRole: "/api/v1/admin/roles/{role}/permissions",
    userById: "/api/v1/admin/users/{user_id}"
  },
  verifications: {
    myProgress: "/api/v1/verifications/my-progress",
    myStatus: "/api/v1/verifications/my-status",
    requirements: "/api/v1/verifications/requirements",
    requirementsByAction: "/api/v1/verifications/requirements/{action}",
    requirementToggle: "/api/v1/verifications/requirements/{requirement_id}/toggle"
  },
  breeds: {
    base: "/api/v1/breeds"
  },
  pets: {
    base: "/api/v1/pets",
    byId: "/api/v1/pets/{pet_id}",
    vaccinations: "/api/v1/pets/{pet_id}/vaccinations",
    vaccinationById: "/api/v1/pets/{pet_id}/vaccinations/{vaccination_id}",
    photos: "/api/v1/pets/{pet_id}/photos",
    photoSetPrimary: "/api/v1/pets/{pet_id}/photos/{photo_id}/set-primary",
    photoById: "/api/v1/pets/{pet_id}/photos/{photo_id}"
  },
  profile: {
    me: "/api/v1/profile/me",
    completion: "/api/v1/profile/completion",
    basic: "/api/v1/profile/basic",
    emailRequest: "/api/v1/profile/email/request",
    emailVerify: "/api/v1/profile/email/verify",
    phoneRequest: "/api/v1/profile/phone/request",
    phoneVerify: "/api/v1/profile/phone/verify"
  },
  addresses: {
    countries: "/api/v1/addresses/countries",
    provinces: "/api/v1/addresses/provinces",
    cities: "/api/v1/addresses/cities",
    base: "/api/v1/addresses",
    byId: "/api/v1/addresses/{address_id}"
  },
  provider: {
    apply: "/api/v1/provider/apply",
    application: "/api/v1/provider/application",
    dashboard: "/api/v1/provider/dashboard"
  },
  adminProviders: {
    applications: "/api/v1/admin/providers/applications",
    applicationsPending: "/api/v1/admin/providers/applications/pending",
    applicationById: "/api/v1/admin/providers/applications/{application_id}",
    applicationReview: "/api/v1/admin/providers/applications/{application_id}/review",
    list: "/api/v1/admin/providers/list",
    activate: "/api/v1/admin/providers/{provider_id}/activate",
    deactivate: "/api/v1/admin/providers/{provider_id}/deactivate"
  },
  iranianVerification: {
    nationalCode: "/api/v1/verification/iranian/national-code",
    postalCode: "/api/v1/verification/iranian/postal-code",
    providerAddress: "/api/v1/verification/iranian/provider-address",
    documentUpload: "/api/v1/verification/iranian/documents/upload",
    documents: "/api/v1/verification/iranian/documents",
    status: "/api/v1/verification/iranian/status"
  },
  adminDocuments: {
    pending: "/api/v1/admin/documents/pending",
    byId: "/api/v1/admin/documents/{document_id}",
    review: "/api/v1/admin/documents/{document_id}/review",
    userDocuments: "/api/v1/admin/documents/user/{user_id}/documents"
  },
  adminBlog: {
    base: "/api/v1/admin/blog",
    posts: "/api/v1/admin/blog/posts",
    postById: "/api/v1/admin/blog/posts/{post_id}",
    categories: "/api/v1/admin/blog/categories",
    categoryById: "/api/v1/admin/blog/categories/{category_id}"
  },
  media: {
    upload: "/api/v1/media/upload"
  },
  system: {
    health: "/health",
    root: "/"
  }
} as const;

export type EndpointPath = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
