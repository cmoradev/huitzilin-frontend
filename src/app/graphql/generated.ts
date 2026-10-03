import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type AccountsReceivable = {
  debitId: Scalars['ID']['input'];
};

export type Action = {
  __typename?: 'Action';
  actions: Array<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  policyId: Scalars['String']['output'];
  resources: Scalars['String']['output'];
  route: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
};

export type ActionConnection = {
  __typename?: 'ActionConnection';
  /** Array of nodes. */
  nodes: Array<Action>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type ActionFilter = {
  and?: InputMaybe<Array<ActionFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<ActionFilter>>;
  policyId?: InputMaybe<StringFieldComparison>;
  resources?: InputMaybe<StringFieldComparison>;
  route?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type ActionSort = {
  direction: SortDirection;
  field: ActionSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum ActionSortFields {
  CreatedAt = 'createdAt',
  Id = 'id',
  PolicyId = 'policyId',
  Resources = 'resources',
  Route = 'route',
  UpdatedAt = 'updatedAt'
}

export type AddBranchsToStudentInput = {
  /** The id of the record. */
  id: Scalars['ID']['input'];
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']['input']>;
};

export type AddBranchsToTeacherInput = {
  /** The id of the record. */
  id: Scalars['ID']['input'];
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']['input']>;
};

export type AddPayment = {
  incomeID: Scalars['ID']['input'];
  payments?: InputMaybe<Array<CreatePayment>>;
};

export type AddStudentsToDocumentInput = {
  /** The id of the record. */
  id: Scalars['ID']['input'];
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']['input']>;
};

export type BooleanFieldComparison = {
  is?: InputMaybe<Scalars['Boolean']['input']>;
  isNot?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Branch = {
  __typename?: 'Branch';
  clipAccounts: Array<ClipAccount>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  picture: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
};


export type BranchClipAccountsArgs = {
  filter?: ClipAccountFilter;
  sorting?: Array<ClipAccountSort>;
};

export type BranchConnection = {
  __typename?: 'BranchConnection';
  /** Array of nodes. */
  nodes: Array<Branch>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type BranchDeleteResponse = {
  __typename?: 'BranchDeleteResponse';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  picture?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type BranchFilter = {
  and?: InputMaybe<Array<BranchFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<BranchFilter>>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type BranchSort = {
  direction: SortDirection;
  field: BranchSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum BranchSortFields {
  CreatedAt = 'createdAt',
  Id = 'id',
  Name = 'name',
  UpdatedAt = 'updatedAt'
}

export type ClipAccount = {
  __typename?: 'ClipAccount';
  createdAt: Scalars['DateTime']['output'];
  default: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  error: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  success: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
  webhook: Scalars['String']['output'];
};

export type ClipAccountConnection = {
  __typename?: 'ClipAccountConnection';
  /** Array of nodes. */
  nodes: Array<ClipAccount>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type ClipAccountDeleteResponse = {
  __typename?: 'ClipAccountDeleteResponse';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  default?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
  webhook?: Maybe<Scalars['String']['output']>;
};

export type ClipAccountFilter = {
  and?: InputMaybe<Array<ClipAccountFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<ClipAccountFilter>>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type ClipAccountSort = {
  direction: SortDirection;
  field: ClipAccountSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum ClipAccountSortFields {
  CreatedAt = 'createdAt',
  Id = 'id',
  Name = 'name',
  UpdatedAt = 'updatedAt'
}

export type ClipLink = {
  __typename?: 'ClipLink';
  accountId: Scalars['String']['output'];
  amount: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  incomeId: Scalars['String']['output'];
  link: Scalars['String']['output'];
  qr: Scalars['String']['output'];
  requestId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
};

export type ClipLinkConnection = {
  __typename?: 'ClipLinkConnection';
  /** Array of nodes. */
  nodes: Array<ClipLink>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type ClipLinkFilter = {
  accountId?: InputMaybe<StringFieldComparison>;
  and?: InputMaybe<Array<ClipLinkFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  expiresAt?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  incomeId?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<ClipLinkFilter>>;
  requestId?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type ClipLinkSort = {
  direction: SortDirection;
  field: ClipLinkSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum ClipLinkSortFields {
  AccountId = 'accountId',
  CreatedAt = 'createdAt',
  ExpiresAt = 'expiresAt',
  Id = 'id',
  IncomeId = 'incomeId',
  RequestId = 'requestId',
  UpdatedAt = 'updatedAt'
}

export type Concept = {
  __typename?: 'Concept';
  amount: Scalars['Float']['output'];
  application: ConceptApplication;
  createdAt: Scalars['DateTime']['output'];
  debits: Array<Debit>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description: Scalars['String']['output'];
  discount: Scalars['Float']['output'];
  discounts: Array<Discount>;
  id: Scalars['ID']['output'];
  income: Income;
  incomeId: Scalars['String']['output'];
  pendingPayment: Scalars['Float']['output'];
  quantity: Scalars['Float']['output'];
  subtotal: Scalars['Float']['output'];
  taxes: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
  withTax: Scalars['Boolean']['output'];
};


export type ConceptDebitsArgs = {
  filter?: DebitFilter;
  sorting?: Array<DebitSort>;
};


export type ConceptDiscountsArgs = {
  filter?: DiscountFilter;
  sorting?: Array<DiscountSort>;
};

export enum ConceptApplication {
  AdditionalCharge = 'ADDITIONAL_CHARGE',
  DebtPayment = 'DEBT_PAYMENT',
  DelinquencyCharge = 'DELINQUENCY_CHARGE'
}

export type ConceptApplicationFilterComparison = {
  eq?: InputMaybe<ConceptApplication>;
  gt?: InputMaybe<ConceptApplication>;
  gte?: InputMaybe<ConceptApplication>;
  iLike?: InputMaybe<ConceptApplication>;
  in?: InputMaybe<Array<ConceptApplication>>;
  is?: InputMaybe<Scalars['Boolean']['input']>;
  isNot?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<ConceptApplication>;
  lt?: InputMaybe<ConceptApplication>;
  lte?: InputMaybe<ConceptApplication>;
  neq?: InputMaybe<ConceptApplication>;
  notILike?: InputMaybe<ConceptApplication>;
  notIn?: InputMaybe<Array<ConceptApplication>>;
  notLike?: InputMaybe<ConceptApplication>;
};

export type ConceptConnection = {
  __typename?: 'ConceptConnection';
  /** Array of nodes. */
  nodes: Array<Concept>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type ConceptFilter = {
  and?: InputMaybe<Array<ConceptFilter>>;
  application?: InputMaybe<ConceptApplicationFilterComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  description?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  income?: InputMaybe<ConceptFilterIncomeFilter>;
  incomeId?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<ConceptFilter>>;
  pendingPayment?: InputMaybe<FloatFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type ConceptFilterIncomeFilter = {
  and?: InputMaybe<Array<ConceptFilterIncomeFilter>>;
  branchId?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  folio?: InputMaybe<IntFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<ConceptFilterIncomeFilter>>;
  state?: InputMaybe<IncomeStateFilterComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type ConceptSort = {
  direction: SortDirection;
  field: ConceptSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum ConceptSortFields {
  Application = 'application',
  CreatedAt = 'createdAt',
  Description = 'description',
  Id = 'id',
  IncomeId = 'incomeId',
  PendingPayment = 'pendingPayment',
  UpdatedAt = 'updatedAt'
}

export type CreateAction = {
  actions: Array<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  resources: Scalars['String']['input'];
  route: Scalars['String']['input'];
};

export type CreateBranch = {
  clipAccounts?: InputMaybe<Array<NestedId>>;
  name: Scalars['String']['input'];
  picture: Scalars['String']['input'];
};

export type CreateClipAccount = {
  default: Scalars['String']['input'];
  error: Scalars['String']['input'];
  name: Scalars['String']['input'];
  success: Scalars['String']['input'];
  token: Scalars['String']['input'];
  webhook: Scalars['String']['input'];
};

export type CreateConcept = {
  application: ConceptApplication;
  branchID: Scalars['String']['input'];
  debitId?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  discounts?: InputMaybe<Array<NestedId>>;
  quantity: Scalars['Float']['input'];
  unitPrice: Scalars['Float']['input'];
  withTax: Scalars['Boolean']['input'];
};

export type CreateCycle = {
  end: Scalars['String']['input'];
  name: Scalars['String']['input'];
  start: Scalars['String']['input'];
};

export type CreateDebit = {
  branchId: Scalars['String']['input'];
  delinquency: Scalars['Float']['input'];
  description: Scalars['String']['input'];
  discount: Scalars['Float']['input'];
  discounts?: InputMaybe<Array<NestedId>>;
  dueDate: Scalars['String']['input'];
  enrollmentId: Scalars['String']['input'];
  frequency: Frequency;
  paymentDate?: InputMaybe<Scalars['DateTime']['input']>;
  quantity: Scalars['Float']['input'];
  state: DebitState;
  studentId: Scalars['String']['input'];
  unitPrice: Scalars['Float']['input'];
  withTax: Scalars['Boolean']['input'];
};

export type CreateDiscipline = {
  branchId: Scalars['ID']['input'];
  minHours: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  packages?: InputMaybe<Array<NestedId>>;
};

export type CreateDiscount = {
  branchId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  type: DiscountBy;
  value: Scalars['Float']['input'];
};

export type CreateDocument = {
  key: Scalars['String']['input'];
  name: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type CreateEnrollment = {
  branchId: Scalars['String']['input'];
  cycleId: Scalars['String']['input'];
  details: Scalars['String']['input'];
  diciplines: Scalars['Int']['input'];
  end: Scalars['String']['input'];
  hours: Scalars['Int']['input'];
  levelId: Scalars['String']['input'];
  order: Scalars['Float']['input'];
  packageId: Scalars['String']['input'];
  periodId: Scalars['String']['input'];
  schedules?: InputMaybe<Array<NestedId>>;
  start: Scalars['String']['input'];
  state: EnrollmentState;
  studentId: Scalars['String']['input'];
};

export type CreateFee = {
  amount: Scalars['Float']['input'];
  autoLoad: Scalars['Boolean']['input'];
  frequency: Frequency;
  name: Scalars['String']['input'];
  packageId: Scalars['String']['input'];
  withTax: Scalars['Boolean']['input'];
};

export type CreateIncome = {
  concepts: Array<CreateConcept>;
  payments: Array<CreatePayment>;
  studentIDs: Array<Scalars['String']['input']>;
};

export type CreateLevel = {
  abbreviation: Scalars['String']['input'];
  branchId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  order: Scalars['Float']['input'];
};

export type CreateLinkIncome = {
  concepts: Array<CreateConcept>;
  studentIDs: Array<Scalars['String']['input']>;
};

export type CreateManyClipAccountsInput = {
  /** Array of records to create */
  clipAccounts: Array<CreateClipAccount>;
};

export type CreateManyDebitsInput = {
  /** Array of records to create */
  debits: Array<CreateDebit>;
};

export type CreateManyDiscountsInput = {
  /** Array of records to create */
  discounts: Array<CreateDiscount>;
};

export type CreateManyDocumentsInput = {
  /** Array of records to create */
  documents: Array<CreateDocument>;
};

export type CreateOneBranchInput = {
  /** The record to create */
  branch: CreateBranch;
};

export type CreateOneClipAccountInput = {
  /** The record to create */
  clipAccount: CreateClipAccount;
};

export type CreateOneCycleInput = {
  /** The record to create */
  cycle: CreateCycle;
};

export type CreateOneDebitInput = {
  /** The record to create */
  debit: CreateDebit;
};

export type CreateOneDisciplineInput = {
  /** The record to create */
  discipline: CreateDiscipline;
};

export type CreateOneDiscountInput = {
  /** The record to create */
  discount: CreateDiscount;
};

export type CreateOneDocumentInput = {
  /** The record to create */
  document: CreateDocument;
};

export type CreateOneEnrollmentInput = {
  /** The record to create */
  enrollment: CreateEnrollment;
};

export type CreateOneFeeInput = {
  /** The record to create */
  fee: CreateFee;
};

export type CreateOneLevelInput = {
  /** The record to create */
  level: CreateLevel;
};

export type CreateOnePackageInput = {
  /** The record to create */
  package: CreatePackage;
};

export type CreateOnePeriodInput = {
  /** The record to create */
  period: CreatePeriod;
};

export type CreateOnePolicyInput = {
  /** The record to create */
  policy: CreatePolicy;
};

export type CreateOneScheduleInput = {
  /** The record to create */
  schedule: CreateSchedule;
};

export type CreateOneStudentInput = {
  /** The record to create */
  student: CreateStudent;
};

export type CreateOneTeacherInput = {
  /** The record to create */
  teacher: CreateTeacher;
};

export type CreateOneTutorInput = {
  /** The record to create */
  tutor: CreateTutor;
};

export type CreatePackage = {
  branchId: Scalars['String']['input'];
  kind: PackageKind;
  name: Scalars['String']['input'];
  order: Scalars['Float']['input'];
  quantity: Scalars['Float']['input'];
  withTax: Scalars['Boolean']['input'];
};

export type CreatePayment = {
  amount: Scalars['Float']['input'];
  bank: Scalars['String']['input'];
  date: Scalars['DateTime']['input'];
  method: PaymentMethod;
  transaction: Scalars['String']['input'];
};

export type CreatePeriod = {
  branchId: Scalars['String']['input'];
  days: Scalars['String']['input'];
  end: Scalars['String']['input'];
  firstHour: Scalars['String']['input'];
  lastHour: Scalars['String']['input'];
  name: Scalars['String']['input'];
  order: Scalars['Float']['input'];
  start: Scalars['String']['input'];
};

export type CreatePolicy = {
  actions: Array<CreateAction>;
  name: Scalars['String']['input'];
};

export type CreateSchedule = {
  branchId: Scalars['ID']['input'];
  day: Scalars['Int']['input'];
  disciplineId: Scalars['ID']['input'];
  end: Scalars['String']['input'];
  levels?: InputMaybe<Array<NestedId>>;
  periodId: Scalars['ID']['input'];
  start: Scalars['String']['input'];
  teacherId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateStudent = {
  active: Scalars['Boolean']['input'];
  branchs?: InputMaybe<Array<NestedId>>;
  dateBirth: Scalars['String']['input'];
  dni: Scalars['String']['input'];
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  picture: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateTeacher = {
  branchs?: InputMaybe<Array<NestedId>>;
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  picture: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateTutor = {
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  picture: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type Cycle = {
  __typename?: 'Cycle';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  end: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  start: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
};

export type CycleConnection = {
  __typename?: 'CycleConnection';
  /** Array of nodes. */
  nodes: Array<Cycle>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type CycleDeleteResponse = {
  __typename?: 'CycleDeleteResponse';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  end?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  start?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type CycleFilter = {
  and?: InputMaybe<Array<CycleFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<CycleFilter>>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type CycleSort = {
  direction: SortDirection;
  field: CycleSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum CycleSortFields {
  CreatedAt = 'createdAt',
  Id = 'id',
  Name = 'name',
  UpdatedAt = 'updatedAt'
}

export type DateFieldComparison = {
  between?: InputMaybe<DateFieldComparisonBetween>;
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  is?: InputMaybe<Scalars['Boolean']['input']>;
  isNot?: InputMaybe<Scalars['Boolean']['input']>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  neq?: InputMaybe<Scalars['DateTime']['input']>;
  notBetween?: InputMaybe<DateFieldComparisonBetween>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type DateFieldComparisonBetween = {
  lower: Scalars['DateTime']['input'];
  upper: Scalars['DateTime']['input'];
};

export type Debit = {
  __typename?: 'Debit';
  amount: Scalars['Float']['output'];
  branchId: Scalars['String']['output'];
  concepts: Array<Concept>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  delinquency: Scalars['Float']['output'];
  description: Scalars['String']['output'];
  discount: Scalars['Float']['output'];
  discounts: Array<Discount>;
  dueDate: Scalars['String']['output'];
  enrollmentId: Scalars['String']['output'];
  frequency: Frequency;
  id: Scalars['ID']['output'];
  paymentDate?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Float']['output'];
  state: DebitState;
  studentId: Scalars['String']['output'];
  subtotal: Scalars['Float']['output'];
  taxes: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
  withTax: Scalars['Boolean']['output'];
};


export type DebitConceptsArgs = {
  filter?: ConceptFilter;
  sorting?: Array<ConceptSort>;
};


export type DebitDiscountsArgs = {
  filter?: DiscountFilter;
  sorting?: Array<DiscountSort>;
};

export type DebitConnection = {
  __typename?: 'DebitConnection';
  /** Array of nodes. */
  nodes: Array<Debit>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type DebitDeleteResponse = {
  __typename?: 'DebitDeleteResponse';
  amount?: Maybe<Scalars['Float']['output']>;
  branchId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  delinquency?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  discount?: Maybe<Scalars['Float']['output']>;
  dueDate?: Maybe<Scalars['String']['output']>;
  enrollmentId?: Maybe<Scalars['String']['output']>;
  frequency?: Maybe<Frequency>;
  id?: Maybe<Scalars['ID']['output']>;
  paymentDate?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  state?: Maybe<DebitState>;
  studentId?: Maybe<Scalars['String']['output']>;
  subtotal?: Maybe<Scalars['Float']['output']>;
  taxes?: Maybe<Scalars['Float']['output']>;
  total?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
  withTax?: Maybe<Scalars['Boolean']['output']>;
};

export type DebitFilter = {
  and?: InputMaybe<Array<DebitFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  description?: InputMaybe<StringFieldComparison>;
  dueDate?: InputMaybe<StringFieldComparison>;
  enrollmentId?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<DebitFilter>>;
  state?: InputMaybe<DebitStateFilterComparison>;
  studentId?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type DebitSort = {
  direction: SortDirection;
  field: DebitSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum DebitSortFields {
  CreatedAt = 'createdAt',
  Description = 'description',
  DueDate = 'dueDate',
  EnrollmentId = 'enrollmentId',
  Id = 'id',
  State = 'state',
  StudentId = 'studentId',
  UpdatedAt = 'updatedAt'
}

export enum DebitState {
  Canceled = 'CANCELED',
  Condoned = 'CONDONED',
  Debt = 'DEBT',
  Paid = 'PAID',
  PartiallyPaid = 'PARTIALLY_PAID'
}

export type DebitStateFilterComparison = {
  eq?: InputMaybe<DebitState>;
  gt?: InputMaybe<DebitState>;
  gte?: InputMaybe<DebitState>;
  iLike?: InputMaybe<DebitState>;
  in?: InputMaybe<Array<DebitState>>;
  is?: InputMaybe<Scalars['Boolean']['input']>;
  isNot?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<DebitState>;
  lt?: InputMaybe<DebitState>;
  lte?: InputMaybe<DebitState>;
  neq?: InputMaybe<DebitState>;
  notILike?: InputMaybe<DebitState>;
  notIn?: InputMaybe<Array<DebitState>>;
  notLike?: InputMaybe<DebitState>;
};

export type DeleteOneBranchInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']['input'];
};

export type DeleteOneClipAccountInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']['input'];
};

export type DeleteOneCycleInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']['input'];
};

export type DeleteOneDebitInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']['input'];
};

export type DeleteOneDisciplineInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']['input'];
};

export type DeleteOneDiscountInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']['input'];
};

export type DeleteOneDocumentInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']['input'];
};

export type DeleteOneEnrollmentInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']['input'];
};

export type DeleteOneFeeInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']['input'];
};

export type DeleteOneLevelInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']['input'];
};

export type DeleteOnePackageInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']['input'];
};

export type DeleteOnePeriodInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']['input'];
};

export type DeleteOnePolicyInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']['input'];
};

export type DeleteOneScheduleInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']['input'];
};

export type DeleteOneStudentInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']['input'];
};

export type DeleteOneTeacherInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']['input'];
};

export type DeleteOneTutorInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']['input'];
};

export type DeleteOneUserInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']['input'];
};

export type Discipline = {
  __typename?: 'Discipline';
  branchId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  minHours: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  packages: Array<Package>;
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
};


export type DisciplinePackagesArgs = {
  filter?: PackageFilter;
  sorting?: Array<PackageSort>;
};

export type DisciplineConnection = {
  __typename?: 'DisciplineConnection';
  /** Array of nodes. */
  nodes: Array<Discipline>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type DisciplineDeleteResponse = {
  __typename?: 'DisciplineDeleteResponse';
  branchId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  minHours?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type DisciplineFilter = {
  and?: InputMaybe<Array<DisciplineFilter>>;
  branchId?: InputMaybe<IdFilterComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<DisciplineFilter>>;
  packages?: InputMaybe<DisciplineFilterPackageFilter>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type DisciplineFilterPackageFilter = {
  and?: InputMaybe<Array<DisciplineFilterPackageFilter>>;
  branchId?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<DisciplineFilterPackageFilter>>;
  order?: InputMaybe<NumberFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type DisciplineSort = {
  direction: SortDirection;
  field: DisciplineSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum DisciplineSortFields {
  BranchId = 'branchId',
  CreatedAt = 'createdAt',
  Id = 'id',
  Name = 'name',
  UpdatedAt = 'updatedAt'
}

export type Discount = {
  __typename?: 'Discount';
  branchId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  type: DiscountBy;
  updatedAt: Scalars['DateTime']['output'];
  value: Scalars['Float']['output'];
  version: Scalars['Int']['output'];
};

export enum DiscountBy {
  Fixed = 'FIXED',
  Percentage = 'PERCENTAGE'
}

export type DiscountConnection = {
  __typename?: 'DiscountConnection';
  /** Array of nodes. */
  nodes: Array<Discount>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type DiscountDeleteResponse = {
  __typename?: 'DiscountDeleteResponse';
  branchId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  type?: Maybe<DiscountBy>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  value?: Maybe<Scalars['Float']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type DiscountFilter = {
  and?: InputMaybe<Array<DiscountFilter>>;
  branchId?: InputMaybe<IdFilterComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<DiscountFilter>>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type DiscountSort = {
  direction: SortDirection;
  field: DiscountSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum DiscountSortFields {
  BranchId = 'branchId',
  CreatedAt = 'createdAt',
  Id = 'id',
  Name = 'name',
  UpdatedAt = 'updatedAt'
}

export type Document = {
  __typename?: 'Document';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  students: Array<Student>;
  updatedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};


export type DocumentStudentsArgs = {
  filter?: StudentFilter;
  sorting?: Array<StudentSort>;
};

export type DocumentConnection = {
  __typename?: 'DocumentConnection';
  /** Array of nodes. */
  nodes: Array<Document>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type DocumentDeleteResponse = {
  __typename?: 'DocumentDeleteResponse';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type DocumentFilter = {
  and?: InputMaybe<Array<DocumentFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  key?: InputMaybe<StringFieldComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<DocumentFilter>>;
  students?: InputMaybe<DocumentFilterStudentFilter>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type DocumentFilterStudentFilter = {
  active?: InputMaybe<BooleanFieldComparison>;
  and?: InputMaybe<Array<DocumentFilterStudentFilter>>;
  code?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  dni?: InputMaybe<StringFieldComparison>;
  fullname?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<DocumentFilterStudentFilter>>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type DocumentSort = {
  direction: SortDirection;
  field: DocumentSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum DocumentSortFields {
  CreatedAt = 'createdAt',
  Id = 'id',
  Key = 'key',
  Name = 'name',
  UpdatedAt = 'updatedAt'
}

export type Enrollment = {
  __typename?: 'Enrollment';
  branch?: Maybe<Branch>;
  branchId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  cycle?: Maybe<Cycle>;
  cycleId: Scalars['ID']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  details: Scalars['String']['output'];
  diciplines: Scalars['Float']['output'];
  end: Scalars['String']['output'];
  hours: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  level?: Maybe<Level>;
  levelId: Scalars['ID']['output'];
  order: Scalars['Float']['output'];
  package?: Maybe<Package>;
  packageId?: Maybe<Package>;
  period?: Maybe<Period>;
  schedules: Array<Schedule>;
  start: Scalars['String']['output'];
  state: EnrollmentState;
  student?: Maybe<Student>;
  studentId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
};


export type EnrollmentSchedulesArgs = {
  filter?: ScheduleFilter;
  sorting?: Array<ScheduleSort>;
};

export type EnrollmentConnection = {
  __typename?: 'EnrollmentConnection';
  /** Array of nodes. */
  nodes: Array<Enrollment>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type EnrollmentDeleteResponse = {
  __typename?: 'EnrollmentDeleteResponse';
  branchId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  cycleId?: Maybe<Scalars['ID']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  details?: Maybe<Scalars['String']['output']>;
  diciplines?: Maybe<Scalars['Float']['output']>;
  end?: Maybe<Scalars['String']['output']>;
  hours?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  levelId?: Maybe<Scalars['ID']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  packageId?: Maybe<Scalars['ID']['output']>;
  start?: Maybe<Scalars['String']['output']>;
  state?: Maybe<EnrollmentState>;
  studentId?: Maybe<Scalars['ID']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type EnrollmentFilter = {
  and?: InputMaybe<Array<EnrollmentFilter>>;
  branchId?: InputMaybe<IdFilterComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  cycleId?: InputMaybe<IdFilterComparison>;
  details?: InputMaybe<StringFieldComparison>;
  diciplines?: InputMaybe<NumberFieldComparison>;
  hours?: InputMaybe<NumberFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  levelId?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<EnrollmentFilter>>;
  order?: InputMaybe<NumberFieldComparison>;
  packageId?: InputMaybe<IdFilterComparison>;
  schedules?: InputMaybe<EnrollmentFilterScheduleFilter>;
  state?: InputMaybe<EnrollmentStateFilterComparison>;
  studentId?: InputMaybe<IdFilterComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type EnrollmentFilterScheduleFilter = {
  and?: InputMaybe<Array<EnrollmentFilterScheduleFilter>>;
  branchId?: InputMaybe<IdFilterComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  day?: InputMaybe<IntFieldComparison>;
  disciplineId?: InputMaybe<IdFilterComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<EnrollmentFilterScheduleFilter>>;
  periodId?: InputMaybe<IdFilterComparison>;
  teacherId?: InputMaybe<IdFilterComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type EnrollmentSort = {
  direction: SortDirection;
  field: EnrollmentSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum EnrollmentSortFields {
  BranchId = 'branchId',
  CreatedAt = 'createdAt',
  CycleId = 'cycleId',
  Details = 'details',
  Diciplines = 'diciplines',
  Hours = 'hours',
  Id = 'id',
  LevelId = 'levelId',
  Order = 'order',
  PackageId = 'packageId',
  State = 'state',
  StudentId = 'studentId',
  UpdatedAt = 'updatedAt'
}

export enum EnrollmentState {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Paused = 'PAUSED'
}

export type EnrollmentStateFilterComparison = {
  eq?: InputMaybe<EnrollmentState>;
  gt?: InputMaybe<EnrollmentState>;
  gte?: InputMaybe<EnrollmentState>;
  iLike?: InputMaybe<EnrollmentState>;
  in?: InputMaybe<Array<EnrollmentState>>;
  is?: InputMaybe<Scalars['Boolean']['input']>;
  isNot?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<EnrollmentState>;
  lt?: InputMaybe<EnrollmentState>;
  lte?: InputMaybe<EnrollmentState>;
  neq?: InputMaybe<EnrollmentState>;
  notILike?: InputMaybe<EnrollmentState>;
  notIn?: InputMaybe<Array<EnrollmentState>>;
  notLike?: InputMaybe<EnrollmentState>;
};

export type Fee = {
  __typename?: 'Fee';
  amount: Scalars['Float']['output'];
  autoLoad: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  frequency: Frequency;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  packageId: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  taxes: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
  withTax: Scalars['Boolean']['output'];
};

export type FeeConnection = {
  __typename?: 'FeeConnection';
  /** Array of nodes. */
  nodes: Array<Fee>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type FeeDeleteResponse = {
  __typename?: 'FeeDeleteResponse';
  amount?: Maybe<Scalars['Float']['output']>;
  autoLoad?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  frequency?: Maybe<Frequency>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  packageId?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  taxes?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
  withTax?: Maybe<Scalars['Boolean']['output']>;
};

export type FeeFilter = {
  and?: InputMaybe<Array<FeeFilter>>;
  autoLoad?: InputMaybe<BooleanFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<FeeFilter>>;
  packageId?: InputMaybe<StringFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type FeeSort = {
  direction: SortDirection;
  field: FeeSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum FeeSortFields {
  AutoLoad = 'autoLoad',
  CreatedAt = 'createdAt',
  Id = 'id',
  Name = 'name',
  PackageId = 'packageId',
  UpdatedAt = 'updatedAt'
}

export type FloatFieldComparison = {
  between?: InputMaybe<FloatFieldComparisonBetween>;
  eq?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  is?: InputMaybe<Scalars['Boolean']['input']>;
  isNot?: InputMaybe<Scalars['Boolean']['input']>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  neq?: InputMaybe<Scalars['Float']['input']>;
  notBetween?: InputMaybe<FloatFieldComparisonBetween>;
  notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type FloatFieldComparisonBetween = {
  lower: Scalars['Float']['input'];
  upper: Scalars['Float']['input'];
};

export enum Frequency {
  Daily = 'DAILY',
  Hourly = 'HOURLY',
  Monthly = 'MONTHLY',
  Single = 'SINGLE',
  Weekly = 'WEEKLY'
}

export type IdFilterComparison = {
  eq?: InputMaybe<Scalars['ID']['input']>;
  gt?: InputMaybe<Scalars['ID']['input']>;
  gte?: InputMaybe<Scalars['ID']['input']>;
  iLike?: InputMaybe<Scalars['ID']['input']>;
  in?: InputMaybe<Array<Scalars['ID']['input']>>;
  is?: InputMaybe<Scalars['Boolean']['input']>;
  isNot?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['ID']['input']>;
  lt?: InputMaybe<Scalars['ID']['input']>;
  lte?: InputMaybe<Scalars['ID']['input']>;
  neq?: InputMaybe<Scalars['ID']['input']>;
  notILike?: InputMaybe<Scalars['ID']['input']>;
  notIn?: InputMaybe<Array<Scalars['ID']['input']>>;
  notLike?: InputMaybe<Scalars['ID']['input']>;
};

export type Income = {
  __typename?: 'Income';
  amount: Scalars['Float']['output'];
  branchId: Scalars['String']['output'];
  clipLinks: Array<ClipLink>;
  concepts: Array<Concept>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  discount: Scalars['Float']['output'];
  folio: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  payments: Array<Payment>;
  pendingPayment: Scalars['Float']['output'];
  state: IncomeState;
  students: Array<Student>;
  subtotal: Scalars['Float']['output'];
  taxes: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
};


export type IncomeClipLinksArgs = {
  filter?: ClipLinkFilter;
  sorting?: Array<ClipLinkSort>;
};


export type IncomeConceptsArgs = {
  filter?: ConceptFilter;
  sorting?: Array<ConceptSort>;
};


export type IncomePaymentsArgs = {
  filter?: PaymentFilter;
  sorting?: Array<PaymentSort>;
};


export type IncomeStudentsArgs = {
  filter?: StudentFilter;
  sorting?: Array<StudentSort>;
};

export type IncomeConnection = {
  __typename?: 'IncomeConnection';
  /** Array of nodes. */
  nodes: Array<Income>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type IncomeFilter = {
  and?: InputMaybe<Array<IncomeFilter>>;
  branchId?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  folio?: InputMaybe<IntFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<IncomeFilter>>;
  state?: InputMaybe<IncomeStateFilterComparison>;
  students?: InputMaybe<IncomeFilterStudentFilter>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type IncomeFilterStudentFilter = {
  active?: InputMaybe<BooleanFieldComparison>;
  and?: InputMaybe<Array<IncomeFilterStudentFilter>>;
  code?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  dni?: InputMaybe<StringFieldComparison>;
  fullname?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<IncomeFilterStudentFilter>>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type IncomeSort = {
  direction: SortDirection;
  field: IncomeSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum IncomeSortFields {
  BranchId = 'branchId',
  CreatedAt = 'createdAt',
  Folio = 'folio',
  Id = 'id',
  State = 'state',
  UpdatedAt = 'updatedAt'
}

export enum IncomeState {
  Cancelled = 'CANCELLED',
  Paid = 'PAID',
  Pending = 'PENDING'
}

export type IncomeStateFilterComparison = {
  eq?: InputMaybe<IncomeState>;
  gt?: InputMaybe<IncomeState>;
  gte?: InputMaybe<IncomeState>;
  iLike?: InputMaybe<IncomeState>;
  in?: InputMaybe<Array<IncomeState>>;
  is?: InputMaybe<Scalars['Boolean']['input']>;
  isNot?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<IncomeState>;
  lt?: InputMaybe<IncomeState>;
  lte?: InputMaybe<IncomeState>;
  neq?: InputMaybe<IncomeState>;
  notILike?: InputMaybe<IncomeState>;
  notIn?: InputMaybe<Array<IncomeState>>;
  notLike?: InputMaybe<IncomeState>;
};

export type IntFieldComparison = {
  between?: InputMaybe<IntFieldComparisonBetween>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  is?: InputMaybe<Scalars['Boolean']['input']>;
  isNot?: InputMaybe<Scalars['Boolean']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
  notBetween?: InputMaybe<IntFieldComparisonBetween>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type IntFieldComparisonBetween = {
  lower: Scalars['Int']['input'];
  upper: Scalars['Int']['input'];
};

export type Level = {
  __typename?: 'Level';
  abbreviation: Scalars['String']['output'];
  branchId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
};

export type LevelConnection = {
  __typename?: 'LevelConnection';
  /** Array of nodes. */
  nodes: Array<Level>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type LevelDeleteResponse = {
  __typename?: 'LevelDeleteResponse';
  abbreviation?: Maybe<Scalars['String']['output']>;
  branchId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type LevelFilter = {
  abbreviation?: InputMaybe<StringFieldComparison>;
  and?: InputMaybe<Array<LevelFilter>>;
  branchId?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<LevelFilter>>;
  order?: InputMaybe<IntFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type LevelSort = {
  direction: SortDirection;
  field: LevelSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum LevelSortFields {
  Abbreviation = 'abbreviation',
  BranchId = 'branchId',
  CreatedAt = 'createdAt',
  Id = 'id',
  Name = 'name',
  Order = 'order',
  UpdatedAt = 'updatedAt'
}

export type Mutation = {
  __typename?: 'Mutation';
  addBranchsToStudent: Student;
  addBranchsToTeacher: Teacher;
  addPaymentToIncome: Income;
  addStudentsToDocument: Document;
  createIncomes: Array<Income>;
  createLinkIncomes: Array<Income>;
  createManyClipAccounts: Array<ClipAccount>;
  createManyDebits: Array<Debit>;
  createManyDiscounts: Array<Discount>;
  createManyDocuments: Array<Document>;
  createOneBranch: Branch;
  createOneClipAccount: ClipAccount;
  createOneCycle: Cycle;
  createOneDebit: Debit;
  createOneDiscipline: Discipline;
  createOneDiscount: Discount;
  createOneDocument: Document;
  createOneEnrollment: Enrollment;
  createOneFee: Fee;
  createOneLevel: Level;
  createOnePackage: Package;
  createOnePeriod: Period;
  createOnePolicy: Policy;
  createOneSchedule: Schedule;
  createOneStudent: Student;
  createOneTeacher: Teacher;
  createOneTutor: Tutor;
  deleteOneBranch: BranchDeleteResponse;
  deleteOneClipAccount: ClipAccountDeleteResponse;
  deleteOneCycle: CycleDeleteResponse;
  deleteOneDebit: DebitDeleteResponse;
  deleteOneDiscipline: DisciplineDeleteResponse;
  deleteOneDiscount: DiscountDeleteResponse;
  deleteOneDocument: DocumentDeleteResponse;
  deleteOneEnrollment: EnrollmentDeleteResponse;
  deleteOneFee: FeeDeleteResponse;
  deleteOneLevel: LevelDeleteResponse;
  deleteOnePackage: PackageDeleteResponse;
  deleteOnePeriod: PeriodDeleteResponse;
  deleteOnePolicy: PolicyDeleteResponse;
  deleteOneSchedule: ScheduleDeleteResponse;
  deleteOneStudent: StudentDeleteResponse;
  deleteOneTeacher: TeacherDeleteResponse;
  deleteOneTutor: TutorDeleteResponse;
  deleteOneUser: UserDeleteResponse;
  removeBranchsFromStudent: Student;
  removeBranchsFromTeacher: Teacher;
  removeStudentsFromDocument: Document;
  restoreManyActions: UpdateManyResponse;
  restoreManyBranchs: UpdateManyResponse;
  restoreManyClipAccounts: UpdateManyResponse;
  restoreManyConcepts: UpdateManyResponse;
  restoreManyCycles: UpdateManyResponse;
  restoreManyDebits: UpdateManyResponse;
  restoreManyDisciplines: UpdateManyResponse;
  restoreManyDiscounts: UpdateManyResponse;
  restoreManyDocuments: UpdateManyResponse;
  restoreManyEnrollments: UpdateManyResponse;
  restoreManyFees: UpdateManyResponse;
  restoreManyLevels: UpdateManyResponse;
  restoreManyPackages: UpdateManyResponse;
  restoreManyPayments: UpdateManyResponse;
  restoreManyPeriods: UpdateManyResponse;
  restoreManyPolicies: UpdateManyResponse;
  restoreManySchedules: UpdateManyResponse;
  restoreManyStudents: UpdateManyResponse;
  restoreManyTeachers: UpdateManyResponse;
  restoreManyTutors: UpdateManyResponse;
  restoreOneAction: Action;
  restoreOneBranch: Branch;
  restoreOneClipAccount: ClipAccount;
  restoreOneConcept: Concept;
  restoreOneCycle: Cycle;
  restoreOneDebit: Debit;
  restoreOneDiscipline: Discipline;
  restoreOneDiscount: Discount;
  restoreOneDocument: Document;
  restoreOneEnrollment: Enrollment;
  restoreOneFee: Fee;
  restoreOneLevel: Level;
  restoreOnePackage: Package;
  restoreOnePayment: Payment;
  restoreOnePeriod: Period;
  restoreOnePolicy: Policy;
  restoreOneSchedule: Schedule;
  restoreOneStudent: Student;
  restoreOneTeacher: Teacher;
  restoreOneTutor: Tutor;
  setBranchsOnStudent: Student;
  setBranchsOnTeacher: Teacher;
  setOrderEnrollments: UpdateCount;
  setOrderLevels: UpdateCount;
  setOrderPackages: UpdateCount;
  setOrderPeriods: UpdateCount;
  setStudentsOnDocument: Document;
  signIn: Session;
  signUp: Session;
  updateManyPackages: UpdateManyResponse;
  updateOneBranch: Branch;
  updateOneClipAccount: ClipAccount;
  updateOneCycle: Cycle;
  updateOneDebit: Debit;
  updateOneDiscipline: Discipline;
  updateOneDiscount: Discount;
  updateOneDocument: Document;
  updateOneEnrollment: Enrollment;
  updateOneFee: Fee;
  updateOneLevel: Level;
  updateOnePackage: Package;
  updateOnePeriod: Period;
  updateOnePolicy: Policy;
  updateOneSchedule: Schedule;
  updateOneStudent: Student;
  updateOneTeacher: Teacher;
  updateOneTutor: Tutor;
  updateOneUser: User;
};


export type MutationAddBranchsToStudentArgs = {
  input: AddBranchsToStudentInput;
};


export type MutationAddBranchsToTeacherArgs = {
  input: AddBranchsToTeacherInput;
};


export type MutationAddPaymentToIncomeArgs = {
  input: AddPayment;
};


export type MutationAddStudentsToDocumentArgs = {
  input: AddStudentsToDocumentInput;
};


export type MutationCreateIncomesArgs = {
  input: CreateIncome;
};


export type MutationCreateLinkIncomesArgs = {
  input: CreateLinkIncome;
};


export type MutationCreateManyClipAccountsArgs = {
  input: CreateManyClipAccountsInput;
};


export type MutationCreateManyDebitsArgs = {
  input: CreateManyDebitsInput;
};


export type MutationCreateManyDiscountsArgs = {
  input: CreateManyDiscountsInput;
};


export type MutationCreateManyDocumentsArgs = {
  input: CreateManyDocumentsInput;
};


export type MutationCreateOneBranchArgs = {
  input: CreateOneBranchInput;
};


export type MutationCreateOneClipAccountArgs = {
  input: CreateOneClipAccountInput;
};


export type MutationCreateOneCycleArgs = {
  input: CreateOneCycleInput;
};


export type MutationCreateOneDebitArgs = {
  input: CreateOneDebitInput;
};


export type MutationCreateOneDisciplineArgs = {
  input: CreateOneDisciplineInput;
};


export type MutationCreateOneDiscountArgs = {
  input: CreateOneDiscountInput;
};


export type MutationCreateOneDocumentArgs = {
  input: CreateOneDocumentInput;
};


export type MutationCreateOneEnrollmentArgs = {
  input: CreateOneEnrollmentInput;
};


export type MutationCreateOneFeeArgs = {
  input: CreateOneFeeInput;
};


export type MutationCreateOneLevelArgs = {
  input: CreateOneLevelInput;
};


export type MutationCreateOnePackageArgs = {
  input: CreateOnePackageInput;
};


export type MutationCreateOnePeriodArgs = {
  input: CreateOnePeriodInput;
};


export type MutationCreateOnePolicyArgs = {
  input: CreateOnePolicyInput;
};


export type MutationCreateOneScheduleArgs = {
  input: CreateOneScheduleInput;
};


export type MutationCreateOneStudentArgs = {
  input: CreateOneStudentInput;
};


export type MutationCreateOneTeacherArgs = {
  input: CreateOneTeacherInput;
};


export type MutationCreateOneTutorArgs = {
  input: CreateOneTutorInput;
};


export type MutationDeleteOneBranchArgs = {
  input: DeleteOneBranchInput;
};


export type MutationDeleteOneClipAccountArgs = {
  input: DeleteOneClipAccountInput;
};


export type MutationDeleteOneCycleArgs = {
  input: DeleteOneCycleInput;
};


export type MutationDeleteOneDebitArgs = {
  input: DeleteOneDebitInput;
};


export type MutationDeleteOneDisciplineArgs = {
  input: DeleteOneDisciplineInput;
};


export type MutationDeleteOneDiscountArgs = {
  input: DeleteOneDiscountInput;
};


export type MutationDeleteOneDocumentArgs = {
  input: DeleteOneDocumentInput;
};


export type MutationDeleteOneEnrollmentArgs = {
  input: DeleteOneEnrollmentInput;
};


export type MutationDeleteOneFeeArgs = {
  input: DeleteOneFeeInput;
};


export type MutationDeleteOneLevelArgs = {
  input: DeleteOneLevelInput;
};


export type MutationDeleteOnePackageArgs = {
  input: DeleteOnePackageInput;
};


export type MutationDeleteOnePeriodArgs = {
  input: DeleteOnePeriodInput;
};


export type MutationDeleteOnePolicyArgs = {
  input: DeleteOnePolicyInput;
};


export type MutationDeleteOneScheduleArgs = {
  input: DeleteOneScheduleInput;
};


export type MutationDeleteOneStudentArgs = {
  input: DeleteOneStudentInput;
};


export type MutationDeleteOneTeacherArgs = {
  input: DeleteOneTeacherInput;
};


export type MutationDeleteOneTutorArgs = {
  input: DeleteOneTutorInput;
};


export type MutationDeleteOneUserArgs = {
  input: DeleteOneUserInput;
};


export type MutationRemoveBranchsFromStudentArgs = {
  input: RemoveBranchsFromStudentInput;
};


export type MutationRemoveBranchsFromTeacherArgs = {
  input: RemoveBranchsFromTeacherInput;
};


export type MutationRemoveStudentsFromDocumentArgs = {
  input: RemoveStudentsFromDocumentInput;
};


export type MutationRestoreManyActionsArgs = {
  input: ActionFilter;
};


export type MutationRestoreManyBranchsArgs = {
  input: BranchFilter;
};


export type MutationRestoreManyClipAccountsArgs = {
  input: DiscountFilter;
};


export type MutationRestoreManyConceptsArgs = {
  input: ConceptFilter;
};


export type MutationRestoreManyCyclesArgs = {
  input: CycleFilter;
};


export type MutationRestoreManyDebitsArgs = {
  input: DebitFilter;
};


export type MutationRestoreManyDisciplinesArgs = {
  input: DisciplineFilter;
};


export type MutationRestoreManyDiscountsArgs = {
  input: DiscountFilter;
};


export type MutationRestoreManyDocumentsArgs = {
  input: DocumentFilter;
};


export type MutationRestoreManyEnrollmentsArgs = {
  input: EnrollmentFilter;
};


export type MutationRestoreManyFeesArgs = {
  input: FeeFilter;
};


export type MutationRestoreManyLevelsArgs = {
  input: LevelFilter;
};


export type MutationRestoreManyPackagesArgs = {
  input: PackageFilter;
};


export type MutationRestoreManyPaymentsArgs = {
  input: PaymentFilter;
};


export type MutationRestoreManyPeriodsArgs = {
  input: PeriodFilter;
};


export type MutationRestoreManyPoliciesArgs = {
  input: PolicyFilter;
};


export type MutationRestoreManySchedulesArgs = {
  input: ScheduleFilter;
};


export type MutationRestoreManyStudentsArgs = {
  input: StudentFilter;
};


export type MutationRestoreManyTeachersArgs = {
  input: TeacherFilter;
};


export type MutationRestoreManyTutorsArgs = {
  input: TutorFilter;
};


export type MutationRestoreOneActionArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOneBranchArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOneClipAccountArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOneConceptArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOneCycleArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOneDebitArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOneDisciplineArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOneDiscountArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOneDocumentArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOneEnrollmentArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOneFeeArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOneLevelArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOnePackageArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOnePaymentArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOnePeriodArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOnePolicyArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOneScheduleArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOneStudentArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOneTeacherArgs = {
  input: Scalars['ID']['input'];
};


export type MutationRestoreOneTutorArgs = {
  input: Scalars['ID']['input'];
};


export type MutationSetBranchsOnStudentArgs = {
  input: SetBranchsOnStudentInput;
};


export type MutationSetBranchsOnTeacherArgs = {
  input: SetBranchsOnTeacherInput;
};


export type MutationSetOrderEnrollmentsArgs = {
  input: Array<SetOrderInput>;
};


export type MutationSetOrderLevelsArgs = {
  input: Array<SetOrderInput>;
};


export type MutationSetOrderPackagesArgs = {
  input: Array<SetOrderInput>;
};


export type MutationSetOrderPeriodsArgs = {
  input: Array<SetOrderInput>;
};


export type MutationSetStudentsOnDocumentArgs = {
  input: SetStudentsOnDocumentInput;
};


export type MutationSignInArgs = {
  input: SignInInput;
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationUpdateManyPackagesArgs = {
  input: UpdateManyPackagesInput;
};


export type MutationUpdateOneBranchArgs = {
  input: UpdateOneBranchInput;
};


export type MutationUpdateOneClipAccountArgs = {
  input: UpdateOneClipAccountInput;
};


export type MutationUpdateOneCycleArgs = {
  input: UpdateOneCycleInput;
};


export type MutationUpdateOneDebitArgs = {
  input: UpdateOneDebitInput;
};


export type MutationUpdateOneDisciplineArgs = {
  input: UpdateOneDisciplineInput;
};


export type MutationUpdateOneDiscountArgs = {
  input: UpdateOneDiscountInput;
};


export type MutationUpdateOneDocumentArgs = {
  input: UpdateOneDocumentInput;
};


export type MutationUpdateOneEnrollmentArgs = {
  input: UpdateOneEnrollmentInput;
};


export type MutationUpdateOneFeeArgs = {
  input: UpdateOneFeeInput;
};


export type MutationUpdateOneLevelArgs = {
  input: UpdateOneLevelInput;
};


export type MutationUpdateOnePackageArgs = {
  input: UpdateOnePackageInput;
};


export type MutationUpdateOnePeriodArgs = {
  input: UpdateOnePeriodInput;
};


export type MutationUpdateOnePolicyArgs = {
  input: UpdateOnePolicyInput;
};


export type MutationUpdateOneScheduleArgs = {
  input: UpdateOneScheduleInput;
};


export type MutationUpdateOneStudentArgs = {
  input: UpdateOneStudentInput;
};


export type MutationUpdateOneTeacherArgs = {
  input: UpdateOneTeacherInput;
};


export type MutationUpdateOneTutorArgs = {
  input: UpdateOneTutorInput;
};


export type MutationUpdateOneUserArgs = {
  input: UpdateOneUserInput;
};

export type NestedId = {
  id: Scalars['ID']['input'];
};

export type NumberFieldComparison = {
  between?: InputMaybe<NumberFieldComparisonBetween>;
  eq?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  is?: InputMaybe<Scalars['Boolean']['input']>;
  isNot?: InputMaybe<Scalars['Boolean']['input']>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  neq?: InputMaybe<Scalars['Float']['input']>;
  notBetween?: InputMaybe<NumberFieldComparisonBetween>;
  notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type NumberFieldComparisonBetween = {
  lower: Scalars['Float']['input'];
  upper: Scalars['Float']['input'];
};

export type OffsetPageInfo = {
  __typename?: 'OffsetPageInfo';
  /** true if paging forward and there are more records. */
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  /** true if paging backwards and there are more records. */
  hasPreviousPage?: Maybe<Scalars['Boolean']['output']>;
};

export type OffsetPaging = {
  /** Limit the number of records returned */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Offset to start returning records from */
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Package = {
  __typename?: 'Package';
  branchId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  kind: PackageKind;
  name: Scalars['String']['output'];
  order: Scalars['Float']['output'];
  quantity: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
  withTax: Scalars['Boolean']['output'];
};

export type PackageConnection = {
  __typename?: 'PackageConnection';
  /** Array of nodes. */
  nodes: Array<Package>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type PackageDeleteResponse = {
  __typename?: 'PackageDeleteResponse';
  branchId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  kind?: Maybe<PackageKind>;
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
  withTax?: Maybe<Scalars['Boolean']['output']>;
};

export type PackageFilter = {
  and?: InputMaybe<Array<PackageFilter>>;
  branchId?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<PackageFilter>>;
  order?: InputMaybe<NumberFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export enum PackageKind {
  Hours = 'HOURS',
  Quantity = 'QUANTITY',
  Unlimited = 'UNLIMITED'
}

export type PackageSort = {
  direction: SortDirection;
  field: PackageSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum PackageSortFields {
  BranchId = 'branchId',
  CreatedAt = 'createdAt',
  Id = 'id',
  Name = 'name',
  Order = 'order',
  UpdatedAt = 'updatedAt'
}

export type PackageUpdateFilter = {
  and?: InputMaybe<Array<PackageUpdateFilter>>;
  branchId?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<PackageUpdateFilter>>;
  order?: InputMaybe<NumberFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type Payment = {
  __typename?: 'Payment';
  amount: Scalars['Float']['output'];
  bank: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  folio: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  incomeId: Scalars['String']['output'];
  method: PaymentMethod;
  state: PaymentState;
  transaction: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
};

export type PaymentConnection = {
  __typename?: 'PaymentConnection';
  /** Array of nodes. */
  nodes: Array<Payment>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type PaymentFilter = {
  and?: InputMaybe<Array<PaymentFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  folio?: InputMaybe<IntFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  incomeId?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<PaymentFilter>>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export enum PaymentMethod {
  Card = 'CARD',
  Cash = 'CASH',
  Clip = 'CLIP',
  Transfer = 'TRANSFER'
}

export type PaymentSort = {
  direction: SortDirection;
  field: PaymentSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum PaymentSortFields {
  CreatedAt = 'createdAt',
  Folio = 'folio',
  Id = 'id',
  IncomeId = 'incomeId',
  UpdatedAt = 'updatedAt'
}

export enum PaymentState {
  Cancelled = 'CANCELLED',
  Paid = 'PAID',
  Pending = 'PENDING'
}

export type Period = {
  __typename?: 'Period';
  branchId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  days: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  end: Scalars['String']['output'];
  firstHour: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastHour: Scalars['String']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Float']['output'];
  start: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
};

export type PeriodConnection = {
  __typename?: 'PeriodConnection';
  /** Array of nodes. */
  nodes: Array<Period>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type PeriodDeleteResponse = {
  __typename?: 'PeriodDeleteResponse';
  branchId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  days?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  end?: Maybe<Scalars['String']['output']>;
  firstHour?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lastHour?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  start?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type PeriodFilter = {
  and?: InputMaybe<Array<PeriodFilter>>;
  branchId?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<PeriodFilter>>;
  order?: InputMaybe<NumberFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type PeriodSort = {
  direction: SortDirection;
  field: PeriodSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum PeriodSortFields {
  BranchId = 'branchId',
  CreatedAt = 'createdAt',
  Id = 'id',
  Name = 'name',
  Order = 'order',
  UpdatedAt = 'updatedAt'
}

export type Policy = {
  __typename?: 'Policy';
  actions: Array<Action>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
};


export type PolicyActionsArgs = {
  filter?: ActionFilter;
  sorting?: Array<ActionSort>;
};

export type PolicyConnection = {
  __typename?: 'PolicyConnection';
  /** Array of nodes. */
  nodes: Array<Policy>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type PolicyDeleteResponse = {
  __typename?: 'PolicyDeleteResponse';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type PolicyFilter = {
  and?: InputMaybe<Array<PolicyFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<PolicyFilter>>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type PolicySort = {
  direction: SortDirection;
  field: PolicySortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum PolicySortFields {
  CreatedAt = 'createdAt',
  Id = 'id',
  Name = 'name',
  UpdatedAt = 'updatedAt'
}

export type Query = {
  __typename?: 'Query';
  action: Action;
  actions: ActionConnection;
  branch: Branch;
  branches: BranchConnection;
  clipAccount: ClipAccount;
  clipAccounts: ClipAccountConnection;
  clipLink: ClipLink;
  clipLinks: ClipLinkConnection;
  concept: Concept;
  concepts: ConceptConnection;
  cycle: Cycle;
  cycles: CycleConnection;
  debit: Debit;
  debits: DebitConnection;
  discipline: Discipline;
  disciplines: DisciplineConnection;
  discount: Discount;
  discounts: DiscountConnection;
  document: Document;
  documents: DocumentConnection;
  enrollment: Enrollment;
  enrollments: EnrollmentConnection;
  fee: Fee;
  fees: FeeConnection;
  getAccountsReceivable: Income;
  income: Income;
  incomes: IncomeConnection;
  level: Level;
  levels: LevelConnection;
  package: Package;
  packages: PackageConnection;
  payment: Payment;
  payments: PaymentConnection;
  period: Period;
  periods: PeriodConnection;
  policies: PolicyConnection;
  policy: Policy;
  schedule: Schedule;
  schedules: ScheduleConnection;
  student: Student;
  students: StudentConnection;
  teacher: Teacher;
  teachers: TeacherConnection;
  tutor: Tutor;
  tutors: TutorConnection;
  user: User;
  users: UserConnection;
};


export type QueryActionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryActionsArgs = {
  filter?: ActionFilter;
  paging?: OffsetPaging;
  sorting?: Array<ActionSort>;
};


export type QueryBranchArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBranchesArgs = {
  filter?: BranchFilter;
  paging?: OffsetPaging;
  sorting?: Array<BranchSort>;
};


export type QueryClipAccountArgs = {
  id: Scalars['ID']['input'];
};


export type QueryClipAccountsArgs = {
  filter?: ClipAccountFilter;
  paging?: OffsetPaging;
  sorting?: Array<ClipAccountSort>;
};


export type QueryClipLinkArgs = {
  id: Scalars['ID']['input'];
};


export type QueryClipLinksArgs = {
  filter?: ClipLinkFilter;
  paging?: OffsetPaging;
  sorting?: Array<ClipLinkSort>;
};


export type QueryConceptArgs = {
  id: Scalars['ID']['input'];
};


export type QueryConceptsArgs = {
  filter?: ConceptFilter;
  paging?: OffsetPaging;
  sorting?: Array<ConceptSort>;
};


export type QueryCycleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCyclesArgs = {
  filter?: CycleFilter;
  paging?: OffsetPaging;
  sorting?: Array<CycleSort>;
};


export type QueryDebitArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDebitsArgs = {
  filter?: DebitFilter;
  paging?: OffsetPaging;
  sorting?: Array<DebitSort>;
};


export type QueryDisciplineArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDisciplinesArgs = {
  filter?: DisciplineFilter;
  paging?: OffsetPaging;
  sorting?: Array<DisciplineSort>;
};


export type QueryDiscountArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDiscountsArgs = {
  filter?: DiscountFilter;
  paging?: OffsetPaging;
  sorting?: Array<DiscountSort>;
};


export type QueryDocumentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDocumentsArgs = {
  filter?: DocumentFilter;
  paging?: OffsetPaging;
  sorting?: Array<DocumentSort>;
};


export type QueryEnrollmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEnrollmentsArgs = {
  filter?: EnrollmentFilter;
  paging?: OffsetPaging;
  sorting?: Array<EnrollmentSort>;
};


export type QueryFeeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFeesArgs = {
  filter?: FeeFilter;
  paging?: OffsetPaging;
  sorting?: Array<FeeSort>;
};


export type QueryGetAccountsReceivableArgs = {
  input: AccountsReceivable;
};


export type QueryIncomeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryIncomesArgs = {
  filter?: IncomeFilter;
  paging?: OffsetPaging;
  sorting?: Array<IncomeSort>;
};


export type QueryLevelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLevelsArgs = {
  filter?: LevelFilter;
  paging?: OffsetPaging;
  sorting?: Array<LevelSort>;
};


export type QueryPackageArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPackagesArgs = {
  filter?: PackageFilter;
  paging?: OffsetPaging;
  sorting?: Array<PackageSort>;
};


export type QueryPaymentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPaymentsArgs = {
  filter?: PaymentFilter;
  paging?: OffsetPaging;
  sorting?: Array<PaymentSort>;
};


export type QueryPeriodArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPeriodsArgs = {
  filter?: PeriodFilter;
  paging?: OffsetPaging;
  sorting?: Array<PeriodSort>;
};


export type QueryPoliciesArgs = {
  filter?: PolicyFilter;
  paging?: OffsetPaging;
  sorting?: Array<PolicySort>;
};


export type QueryPolicyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryScheduleArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySchedulesArgs = {
  filter?: ScheduleFilter;
  paging?: OffsetPaging;
  sorting?: Array<ScheduleSort>;
};


export type QueryStudentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStudentsArgs = {
  filter?: StudentFilter;
  paging?: OffsetPaging;
  sorting?: Array<StudentSort>;
};


export type QueryTeacherArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTeachersArgs = {
  filter?: TeacherFilter;
  paging?: OffsetPaging;
  sorting?: Array<TeacherSort>;
};


export type QueryTutorArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTutorsArgs = {
  filter?: TutorFilter;
  paging?: OffsetPaging;
  sorting?: Array<TutorSort>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  filter?: UserFilter;
  paging?: OffsetPaging;
  sorting?: Array<UserSort>;
};

export type RemoveBranchsFromStudentInput = {
  /** The id of the record. */
  id: Scalars['ID']['input'];
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']['input']>;
};

export type RemoveBranchsFromTeacherInput = {
  /** The id of the record. */
  id: Scalars['ID']['input'];
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']['input']>;
};

export type RemoveStudentsFromDocumentInput = {
  /** The id of the record. */
  id: Scalars['ID']['input'];
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']['input']>;
};

export type Schedule = {
  __typename?: 'Schedule';
  branch?: Maybe<Branch>;
  branchId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  day: Scalars['Int']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  discipline?: Maybe<Discipline>;
  disciplineId: Scalars['ID']['output'];
  end: Scalars['String']['output'];
  enrollments: ScheduleEnrollmentsConnection;
  id: Scalars['ID']['output'];
  levels?: Maybe<Array<Level>>;
  period?: Maybe<Period>;
  periodId: Scalars['ID']['output'];
  start: Scalars['String']['output'];
  teacher?: Maybe<Teacher>;
  teacherId?: Maybe<Scalars['ID']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  version: Scalars['Int']['output'];
};


export type ScheduleEnrollmentsArgs = {
  filter?: EnrollmentFilter;
  paging?: OffsetPaging;
  sorting?: Array<EnrollmentSort>;
};


export type ScheduleLevelsArgs = {
  filter?: LevelFilter;
  sorting?: Array<LevelSort>;
};

export type ScheduleConnection = {
  __typename?: 'ScheduleConnection';
  /** Array of nodes. */
  nodes: Array<Schedule>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type ScheduleDeleteResponse = {
  __typename?: 'ScheduleDeleteResponse';
  branchId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  day?: Maybe<Scalars['Int']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  disciplineId?: Maybe<Scalars['ID']['output']>;
  end?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  periodId?: Maybe<Scalars['ID']['output']>;
  start?: Maybe<Scalars['String']['output']>;
  teacherId?: Maybe<Scalars['ID']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type ScheduleEnrollmentsConnection = {
  __typename?: 'ScheduleEnrollmentsConnection';
  /** Array of nodes. */
  nodes: Array<Enrollment>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type ScheduleFilter = {
  and?: InputMaybe<Array<ScheduleFilter>>;
  branchId?: InputMaybe<IdFilterComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  day?: InputMaybe<IntFieldComparison>;
  disciplineId?: InputMaybe<IdFilterComparison>;
  enrollments?: InputMaybe<ScheduleFilterEnrollmentFilter>;
  id?: InputMaybe<IdFilterComparison>;
  levels?: InputMaybe<ScheduleFilterLevelFilter>;
  or?: InputMaybe<Array<ScheduleFilter>>;
  periodId?: InputMaybe<IdFilterComparison>;
  teacherId?: InputMaybe<IdFilterComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type ScheduleFilterEnrollmentFilter = {
  and?: InputMaybe<Array<ScheduleFilterEnrollmentFilter>>;
  branchId?: InputMaybe<IdFilterComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  cycleId?: InputMaybe<IdFilterComparison>;
  details?: InputMaybe<StringFieldComparison>;
  diciplines?: InputMaybe<NumberFieldComparison>;
  hours?: InputMaybe<NumberFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  levelId?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<ScheduleFilterEnrollmentFilter>>;
  order?: InputMaybe<NumberFieldComparison>;
  packageId?: InputMaybe<IdFilterComparison>;
  state?: InputMaybe<EnrollmentStateFilterComparison>;
  studentId?: InputMaybe<IdFilterComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type ScheduleFilterLevelFilter = {
  abbreviation?: InputMaybe<StringFieldComparison>;
  and?: InputMaybe<Array<ScheduleFilterLevelFilter>>;
  branchId?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<ScheduleFilterLevelFilter>>;
  order?: InputMaybe<IntFieldComparison>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type ScheduleSort = {
  direction: SortDirection;
  field: ScheduleSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum ScheduleSortFields {
  BranchId = 'branchId',
  CreatedAt = 'createdAt',
  Day = 'day',
  DisciplineId = 'disciplineId',
  Id = 'id',
  PeriodId = 'periodId',
  TeacherId = 'teacherId',
  UpdatedAt = 'updatedAt'
}

export type Session = {
  __typename?: 'Session';
  branch?: Maybe<Branch>;
  cycle?: Maybe<Cycle>;
  exp: Scalars['DateTime']['output'];
  iat: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  token: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type SetBranchsOnStudentInput = {
  /** The id of the record. */
  id: Scalars['ID']['input'];
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']['input']>;
};

export type SetBranchsOnTeacherInput = {
  /** The id of the record. */
  id: Scalars['ID']['input'];
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']['input']>;
};

export type SetOrderInput = {
  id: Scalars['ID']['input'];
  order: Scalars['Float']['input'];
};

export type SetStudentsOnDocumentInput = {
  /** The id of the record. */
  id: Scalars['ID']['input'];
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']['input']>;
};

export type SignInInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type SignUpInput = {
  branchId?: InputMaybe<Scalars['String']['input']>;
  cycleId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

/** Sort Directions */
export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

/** Sort Nulls Options */
export enum SortNulls {
  NullsFirst = 'NULLS_FIRST',
  NullsLast = 'NULLS_LAST'
}

export type StringFieldComparison = {
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  iLike?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  is?: InputMaybe<Scalars['Boolean']['input']>;
  isNot?: InputMaybe<Scalars['Boolean']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  notILike?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  notLike?: InputMaybe<Scalars['String']['input']>;
};

export type Student = {
  __typename?: 'Student';
  active: Scalars['Boolean']['output'];
  branchs: Array<Branch>;
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  dateBirth: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  dni: Scalars['String']['output'];
  firstname: Scalars['String']['output'];
  fullname: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastname: Scalars['String']['output'];
  picture: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId?: Maybe<Scalars['String']['output']>;
  version: Scalars['Int']['output'];
};


export type StudentBranchsArgs = {
  filter?: BranchFilter;
  sorting?: Array<BranchSort>;
};

export type StudentConnection = {
  __typename?: 'StudentConnection';
  /** Array of nodes. */
  nodes: Array<Student>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type StudentDeleteResponse = {
  __typename?: 'StudentDeleteResponse';
  active?: Maybe<Scalars['Boolean']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  dateBirth?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  dni?: Maybe<Scalars['String']['output']>;
  firstname?: Maybe<Scalars['String']['output']>;
  fullname?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lastname?: Maybe<Scalars['String']['output']>;
  picture?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type StudentFilter = {
  active?: InputMaybe<BooleanFieldComparison>;
  and?: InputMaybe<Array<StudentFilter>>;
  branchs?: InputMaybe<StudentFilterBranchFilter>;
  code?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  dni?: InputMaybe<StringFieldComparison>;
  fullname?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<StudentFilter>>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type StudentFilterBranchFilter = {
  and?: InputMaybe<Array<StudentFilterBranchFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<StudentFilterBranchFilter>>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type StudentSort = {
  direction: SortDirection;
  field: StudentSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum StudentSortFields {
  Active = 'active',
  Code = 'code',
  CreatedAt = 'createdAt',
  Dni = 'dni',
  Fullname = 'fullname',
  Id = 'id',
  UpdatedAt = 'updatedAt'
}

export type Teacher = {
  __typename?: 'Teacher';
  branchs: Array<Branch>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  firstname: Scalars['String']['output'];
  fullname: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastname: Scalars['String']['output'];
  picture: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId?: Maybe<Scalars['String']['output']>;
  version: Scalars['Int']['output'];
};


export type TeacherBranchsArgs = {
  filter?: BranchFilter;
  sorting?: Array<BranchSort>;
};

export type TeacherConnection = {
  __typename?: 'TeacherConnection';
  /** Array of nodes. */
  nodes: Array<Teacher>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type TeacherDeleteResponse = {
  __typename?: 'TeacherDeleteResponse';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  firstname?: Maybe<Scalars['String']['output']>;
  fullname?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lastname?: Maybe<Scalars['String']['output']>;
  picture?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type TeacherFilter = {
  and?: InputMaybe<Array<TeacherFilter>>;
  branchs?: InputMaybe<TeacherFilterBranchFilter>;
  createdAt?: InputMaybe<DateFieldComparison>;
  fullname?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<TeacherFilter>>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type TeacherFilterBranchFilter = {
  and?: InputMaybe<Array<TeacherFilterBranchFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  name?: InputMaybe<StringFieldComparison>;
  or?: InputMaybe<Array<TeacherFilterBranchFilter>>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type TeacherSort = {
  direction: SortDirection;
  field: TeacherSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum TeacherSortFields {
  CreatedAt = 'createdAt',
  Fullname = 'fullname',
  Id = 'id',
  UpdatedAt = 'updatedAt'
}

export type Tutor = {
  __typename?: 'Tutor';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  firstname: Scalars['String']['output'];
  fullname: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastname: Scalars['String']['output'];
  picture: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type TutorConnection = {
  __typename?: 'TutorConnection';
  /** Array of nodes. */
  nodes: Array<Tutor>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type TutorDeleteResponse = {
  __typename?: 'TutorDeleteResponse';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  firstname?: Maybe<Scalars['String']['output']>;
  fullname?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lastname?: Maybe<Scalars['String']['output']>;
  picture?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type TutorFilter = {
  and?: InputMaybe<Array<TutorFilter>>;
  createdAt?: InputMaybe<DateFieldComparison>;
  fullname?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<TutorFilter>>;
  updatedAt?: InputMaybe<DateFieldComparison>;
};

export type TutorSort = {
  direction: SortDirection;
  field: TutorSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum TutorSortFields {
  CreatedAt = 'createdAt',
  Fullname = 'fullname',
  Id = 'id',
  UpdatedAt = 'updatedAt'
}

export type UpdateBranch = {
  clipAccounts?: InputMaybe<Array<NestedId>>;
  name?: InputMaybe<Scalars['String']['input']>;
  picture?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateClipAccount = {
  default?: InputMaybe<Scalars['String']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  success?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  webhook?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCount = {
  __typename?: 'UpdateCount';
  updatedCount?: Maybe<Scalars['Int']['output']>;
};

export type UpdateCycle = {
  end?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDebit = {
  branchId?: InputMaybe<Scalars['String']['input']>;
  delinquency?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discount?: InputMaybe<Scalars['Float']['input']>;
  discounts?: InputMaybe<Array<NestedId>>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  enrollmentId?: InputMaybe<Scalars['String']['input']>;
  frequency?: InputMaybe<Frequency>;
  paymentDate?: InputMaybe<Scalars['DateTime']['input']>;
  quantity?: InputMaybe<Scalars['Float']['input']>;
  state?: InputMaybe<DebitState>;
  studentId?: InputMaybe<Scalars['String']['input']>;
  unitPrice?: InputMaybe<Scalars['Float']['input']>;
  withTax?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateDiscipline = {
  branchId?: InputMaybe<Scalars['ID']['input']>;
  minHours?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  packages?: InputMaybe<Array<NestedId>>;
};

export type UpdateDiscount = {
  branchId?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<DiscountBy>;
  value?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateDocument = {
  key?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEnrollment = {
  branchId?: InputMaybe<Scalars['String']['input']>;
  cycleId?: InputMaybe<Scalars['String']['input']>;
  details?: InputMaybe<Scalars['String']['input']>;
  diciplines?: InputMaybe<Scalars['Int']['input']>;
  end?: InputMaybe<Scalars['String']['input']>;
  hours?: InputMaybe<Scalars['Int']['input']>;
  levelId?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  packageId?: InputMaybe<Scalars['String']['input']>;
  periodId?: InputMaybe<Scalars['String']['input']>;
  schedules?: InputMaybe<Array<NestedId>>;
  start?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<EnrollmentState>;
  studentId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFee = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  autoLoad?: InputMaybe<Scalars['Boolean']['input']>;
  frequency?: InputMaybe<Frequency>;
  name?: InputMaybe<Scalars['String']['input']>;
  packageId?: InputMaybe<Scalars['String']['input']>;
  withTax?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateLevel = {
  abbreviation?: InputMaybe<Scalars['String']['input']>;
  branchId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateManyPackagesInput = {
  /** Filter used to find fields to update */
  filter: PackageUpdateFilter;
  /** The update to apply to all records found using the filter */
  update: UpdatePackage;
};

export type UpdateManyResponse = {
  __typename?: 'UpdateManyResponse';
  /** The number of records updated. */
  updatedCount: Scalars['Int']['output'];
};

export type UpdateOneBranchInput = {
  /** The id of the record to update */
  id: Scalars['ID']['input'];
  /** The update to apply. */
  update: UpdateBranch;
};

export type UpdateOneClipAccountInput = {
  /** The id of the record to update */
  id: Scalars['ID']['input'];
  /** The update to apply. */
  update: UpdateClipAccount;
};

export type UpdateOneCycleInput = {
  /** The id of the record to update */
  id: Scalars['ID']['input'];
  /** The update to apply. */
  update: UpdateCycle;
};

export type UpdateOneDebitInput = {
  /** The id of the record to update */
  id: Scalars['ID']['input'];
  /** The update to apply. */
  update: UpdateDebit;
};

export type UpdateOneDisciplineInput = {
  /** The id of the record to update */
  id: Scalars['ID']['input'];
  /** The update to apply. */
  update: UpdateDiscipline;
};

export type UpdateOneDiscountInput = {
  /** The id of the record to update */
  id: Scalars['ID']['input'];
  /** The update to apply. */
  update: UpdateDiscount;
};

export type UpdateOneDocumentInput = {
  /** The id of the record to update */
  id: Scalars['ID']['input'];
  /** The update to apply. */
  update: UpdateDocument;
};

export type UpdateOneEnrollmentInput = {
  /** The id of the record to update */
  id: Scalars['ID']['input'];
  /** The update to apply. */
  update: UpdateEnrollment;
};

export type UpdateOneFeeInput = {
  /** The id of the record to update */
  id: Scalars['ID']['input'];
  /** The update to apply. */
  update: UpdateFee;
};

export type UpdateOneLevelInput = {
  /** The id of the record to update */
  id: Scalars['ID']['input'];
  /** The update to apply. */
  update: UpdateLevel;
};

export type UpdateOnePackageInput = {
  /** The id of the record to update */
  id: Scalars['ID']['input'];
  /** The update to apply. */
  update: UpdatePackage;
};

export type UpdateOnePeriodInput = {
  /** The id of the record to update */
  id: Scalars['ID']['input'];
  /** The update to apply. */
  update: UpdatePeriod;
};

export type UpdateOnePolicyInput = {
  /** The id of the record to update */
  id: Scalars['ID']['input'];
  /** The update to apply. */
  update: UpdatePolicy;
};

export type UpdateOneScheduleInput = {
  /** The id of the record to update */
  id: Scalars['ID']['input'];
  /** The update to apply. */
  update: UpdateSchedule;
};

export type UpdateOneStudentInput = {
  /** The id of the record to update */
  id: Scalars['ID']['input'];
  /** The update to apply. */
  update: UpdateStudent;
};

export type UpdateOneTeacherInput = {
  /** The id of the record to update */
  id: Scalars['ID']['input'];
  /** The update to apply. */
  update: UpdateTeacher;
};

export type UpdateOneTutorInput = {
  /** The id of the record to update */
  id: Scalars['ID']['input'];
  /** The update to apply. */
  update: UpdateTutor;
};

export type UpdateOneUserInput = {
  /** The id of the record to update */
  id: Scalars['ID']['input'];
  /** The update to apply. */
  update: UpdateUser;
};

export type UpdatePackage = {
  branchId?: InputMaybe<Scalars['String']['input']>;
  kind?: InputMaybe<PackageKind>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  quantity?: InputMaybe<Scalars['Float']['input']>;
  withTax?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdatePeriod = {
  branchId?: InputMaybe<Scalars['String']['input']>;
  days?: InputMaybe<Scalars['String']['input']>;
  end?: InputMaybe<Scalars['String']['input']>;
  firstHour?: InputMaybe<Scalars['String']['input']>;
  lastHour?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Float']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePolicy = {
  actions?: InputMaybe<Array<CreateAction>>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSchedule = {
  branchId?: InputMaybe<Scalars['ID']['input']>;
  day?: InputMaybe<Scalars['Int']['input']>;
  disciplineId?: InputMaybe<Scalars['ID']['input']>;
  end?: InputMaybe<Scalars['String']['input']>;
  levels?: InputMaybe<Array<NestedId>>;
  periodId?: InputMaybe<Scalars['ID']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
  teacherId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateStudent = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  branchs?: InputMaybe<Array<NestedId>>;
  dateBirth?: InputMaybe<Scalars['String']['input']>;
  dni?: InputMaybe<Scalars['String']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  picture?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTeacher = {
  branchs?: InputMaybe<Array<NestedId>>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  picture?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTutor = {
  firstname?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  lastname?: InputMaybe<Scalars['String']['input']>;
  picture?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUser = {
  branchId?: InputMaybe<Scalars['String']['input']>;
  cycleId?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  policies?: InputMaybe<Array<NestedId>>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  branchId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  cycleId: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  policies: Array<Policy>;
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};


export type UserPoliciesArgs = {
  filter?: PolicyFilter;
  sorting?: Array<PolicySort>;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  /** Array of nodes. */
  nodes: Array<User>;
  /** Paging information */
  pageInfo: OffsetPageInfo;
  /** Fetch total count of records */
  totalCount: Scalars['Int']['output'];
};

export type UserDeleteResponse = {
  __typename?: 'UserDeleteResponse';
  branchId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  cycleId?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  username?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type UserFilter = {
  and?: InputMaybe<Array<UserFilter>>;
  branchId?: InputMaybe<StringFieldComparison>;
  createdAt?: InputMaybe<DateFieldComparison>;
  cycleId?: InputMaybe<StringFieldComparison>;
  email?: InputMaybe<StringFieldComparison>;
  id?: InputMaybe<IdFilterComparison>;
  or?: InputMaybe<Array<UserFilter>>;
  updatedAt?: InputMaybe<DateFieldComparison>;
  username?: InputMaybe<StringFieldComparison>;
};

export type UserSort = {
  direction: SortDirection;
  field: UserSortFields;
  nulls?: InputMaybe<SortNulls>;
};

export enum UserSortFields {
  BranchId = 'branchId',
  CreatedAt = 'createdAt',
  CycleId = 'cycleId',
  Email = 'email',
  Id = 'id',
  UpdatedAt = 'updatedAt',
  Username = 'username'
}

export type SessionPartsFragment = { __typename?: 'Session', id: string, token: string, username: string, exp: any, iat: any, branch?: { __typename?: 'Branch', id: string, picture: string, name: string } | null, cycle?: { __typename?: 'Cycle', id: string, name: string, start: string, end: string } | null };

export type SignInMutationVariables = Exact<{
  input: SignInInput;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'Session', id: string, token: string, username: string, exp: any, iat: any, branch?: { __typename?: 'Branch', id: string, picture: string, name: string } | null, cycle?: { __typename?: 'Cycle', id: string, name: string, start: string, end: string } | null } };

export type SignUpMutationVariables = Exact<{
  input: SignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'Session', id: string, token: string, username: string, exp: any, iat: any, branch?: { __typename?: 'Branch', id: string, picture: string, name: string } | null, cycle?: { __typename?: 'Cycle', id: string, name: string, start: string, end: string } | null } };

export type ClipAccountPartsFragment = { __typename?: 'ClipAccount', id: string, name: string, webhook: string, deletedAt?: any | null, success: string, error: string, default: string };

export type CreateOneClipAccountMutationVariables = Exact<{
  account: CreateClipAccount;
}>;


export type CreateOneClipAccountMutation = { __typename?: 'Mutation', createOneClipAccount: { __typename?: 'ClipAccount', id: string, name: string, webhook: string, deletedAt?: any | null, success: string, error: string, default: string } };

export type GetClipAccountsPageQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<ClipAccountFilter>;
}>;


export type GetClipAccountsPageQuery = { __typename?: 'Query', clipAccounts: { __typename?: 'ClipAccountConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'ClipAccount', id: string, name: string, webhook: string, deletedAt?: any | null, success: string, error: string, default: string }> } };

export type UpdateOneClipAccountMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  update: UpdateClipAccount;
}>;


export type UpdateOneClipAccountMutation = { __typename?: 'Mutation', updateOneClipAccount: { __typename?: 'ClipAccount', id: string, name: string, webhook: string, deletedAt?: any | null, success: string, error: string, default: string } };

export type DeleteOneClipAccountMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOneClipAccountMutation = { __typename?: 'Mutation', deleteOneClipAccount: { __typename?: 'ClipAccountDeleteResponse', id?: string | null } };

export type BranchPartsFragment = { __typename?: 'Branch', id: string, name: string, picture: string, clipAccounts: Array<{ __typename?: 'ClipAccount', id: string, name: string }> };

export type CreateOneBranchMutationVariables = Exact<{
  branch: CreateBranch;
}>;


export type CreateOneBranchMutation = { __typename?: 'Mutation', createOneBranch: { __typename?: 'Branch', id: string, name: string, picture: string, clipAccounts: Array<{ __typename?: 'ClipAccount', id: string, name: string }> } };

export type GetCompaniesPageQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<BranchFilter>;
}>;


export type GetCompaniesPageQuery = { __typename?: 'Query', branches: { __typename?: 'BranchConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'Branch', id: string, name: string, picture: string, clipAccounts: Array<{ __typename?: 'ClipAccount', id: string, name: string }> }> } };

export type UpdateOneBranchMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  update: UpdateBranch;
}>;


export type UpdateOneBranchMutation = { __typename?: 'Mutation', updateOneBranch: { __typename?: 'Branch', id: string, name: string, picture: string, clipAccounts: Array<{ __typename?: 'ClipAccount', id: string, name: string }> } };

export type DeleteOneBranchMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOneBranchMutation = { __typename?: 'Mutation', deleteOneBranch: { __typename?: 'BranchDeleteResponse', id?: string | null } };

export type CyclePartsFragment = { __typename?: 'Cycle', id: string, name: string, start: string, end: string };

export type CreateOneCycleMutationVariables = Exact<{
  cycle: CreateCycle;
}>;


export type CreateOneCycleMutation = { __typename?: 'Mutation', createOneCycle: { __typename?: 'Cycle', id: string, name: string, start: string, end: string } };

export type GetCyclesPageQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<CycleFilter>;
}>;


export type GetCyclesPageQuery = { __typename?: 'Query', cycles: { __typename?: 'CycleConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'Cycle', id: string, name: string, start: string, end: string }> } };

export type UpdateOneCycleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  update: UpdateCycle;
}>;


export type UpdateOneCycleMutation = { __typename?: 'Mutation', updateOneCycle: { __typename?: 'Cycle', id: string, name: string, start: string, end: string } };

export type DeleteOneCycleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOneCycleMutation = { __typename?: 'Mutation', deleteOneCycle: { __typename?: 'CycleDeleteResponse', id?: string | null } };

export type DebitPartsFragment = { __typename?: 'Debit', id: string, description: string, unitPrice: number, quantity: number, amount: number, discount: number, subtotal: number, taxes: number, total: number, withTax: boolean, state: DebitState, frequency: Frequency, delinquency: number, dueDate: string, paymentDate?: string | null, concepts: Array<{ __typename?: 'Concept', pendingPayment: number }>, discounts: Array<{ __typename?: 'Discount', id: string, name: string, value: number, type: DiscountBy }> };

export type CreateOneDebitMutationVariables = Exact<{
  debit: CreateDebit;
}>;


export type CreateOneDebitMutation = { __typename?: 'Mutation', createOneDebit: { __typename?: 'Debit', id: string, description: string, unitPrice: number, quantity: number, amount: number, discount: number, subtotal: number, taxes: number, total: number, withTax: boolean, state: DebitState, frequency: Frequency, delinquency: number, dueDate: string, paymentDate?: string | null, concepts: Array<{ __typename?: 'Concept', pendingPayment: number }>, discounts: Array<{ __typename?: 'Discount', id: string, name: string, value: number, type: DiscountBy }> } };

export type GetDebitsPageQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<DebitFilter>;
}>;


export type GetDebitsPageQuery = { __typename?: 'Query', debits: { __typename?: 'DebitConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'Debit', id: string, description: string, unitPrice: number, quantity: number, amount: number, discount: number, subtotal: number, taxes: number, total: number, withTax: boolean, state: DebitState, frequency: Frequency, delinquency: number, dueDate: string, paymentDate?: string | null, concepts: Array<{ __typename?: 'Concept', pendingPayment: number }>, discounts: Array<{ __typename?: 'Discount', id: string, name: string, value: number, type: DiscountBy }> }> } };

export type UpdateOneDebitMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  update: UpdateDebit;
}>;


export type UpdateOneDebitMutation = { __typename?: 'Mutation', updateOneDebit: { __typename?: 'Debit', id: string, description: string, unitPrice: number, quantity: number, amount: number, discount: number, subtotal: number, taxes: number, total: number, withTax: boolean, state: DebitState, frequency: Frequency, delinquency: number, dueDate: string, paymentDate?: string | null, concepts: Array<{ __typename?: 'Concept', pendingPayment: number }>, discounts: Array<{ __typename?: 'Discount', id: string, name: string, value: number, type: DiscountBy }> } };

export type CreateManyDebitsMutationVariables = Exact<{
  debits: Array<CreateDebit> | CreateDebit;
}>;


export type CreateManyDebitsMutation = { __typename?: 'Mutation', createManyDebits: Array<{ __typename?: 'Debit', id: string, description: string, unitPrice: number, quantity: number, amount: number, discount: number, subtotal: number, taxes: number, total: number, withTax: boolean, state: DebitState, frequency: Frequency, delinquency: number, dueDate: string, paymentDate?: string | null, concepts: Array<{ __typename?: 'Concept', pendingPayment: number }>, discounts: Array<{ __typename?: 'Discount', id: string, name: string, value: number, type: DiscountBy }> }> };

export type DeleteOneDebitMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOneDebitMutation = { __typename?: 'Mutation', deleteOneDebit: { __typename?: 'DebitDeleteResponse', id?: string | null } };

export type DisciplinePartsFragment = { __typename?: 'Discipline', id: string, name: string, minHours: number, packages: Array<{ __typename?: 'Package', id: string, name: string, kind: PackageKind }> };

export type CreateOneDisciplineMutationVariables = Exact<{
  discipline: CreateDiscipline;
}>;


export type CreateOneDisciplineMutation = { __typename?: 'Mutation', createOneDiscipline: { __typename?: 'Discipline', id: string, name: string, minHours: number, packages: Array<{ __typename?: 'Package', id: string, name: string, kind: PackageKind }> } };

export type GetDisciplinesPageQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<DisciplineFilter>;
}>;


export type GetDisciplinesPageQuery = { __typename?: 'Query', disciplines: { __typename?: 'DisciplineConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'Discipline', id: string, name: string, minHours: number, packages: Array<{ __typename?: 'Package', id: string, name: string, kind: PackageKind }> }> } };

export type UpdateOneDisciplineMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  update: UpdateDiscipline;
}>;


export type UpdateOneDisciplineMutation = { __typename?: 'Mutation', updateOneDiscipline: { __typename?: 'Discipline', id: string, name: string, minHours: number, packages: Array<{ __typename?: 'Package', id: string, name: string, kind: PackageKind }> } };

export type DeleteOneDisciplineMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOneDisciplineMutation = { __typename?: 'Mutation', deleteOneDiscipline: { __typename?: 'DisciplineDeleteResponse', id?: string | null } };

export type DiscountPartsFragment = { __typename?: 'Discount', id: string, name: string, value: number, type: DiscountBy };

export type CreateOneDiscountMutationVariables = Exact<{
  discount: CreateDiscount;
}>;


export type CreateOneDiscountMutation = { __typename?: 'Mutation', createOneDiscount: { __typename?: 'Discount', id: string, name: string, value: number, type: DiscountBy } };

export type GetDiscountsPageQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<DiscountFilter>;
}>;


export type GetDiscountsPageQuery = { __typename?: 'Query', discounts: { __typename?: 'DiscountConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'Discount', id: string, name: string, value: number, type: DiscountBy }> } };

export type UpdateOneDiscountMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  update: UpdateDiscount;
}>;


export type UpdateOneDiscountMutation = { __typename?: 'Mutation', updateOneDiscount: { __typename?: 'Discount', id: string, name: string, value: number, type: DiscountBy } };

export type DeleteOneDiscountMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOneDiscountMutation = { __typename?: 'Mutation', deleteOneDiscount: { __typename?: 'DiscountDeleteResponse', id?: string | null } };

export type EnrollmentPartsFragment = { __typename?: 'Enrollment', id: string, details: string, state: EnrollmentState, hours: number, diciplines: number, start: string, end: string, package?: { __typename?: 'Package', id: string, name: string, kind: PackageKind, quantity: number } | null, cycle?: { __typename?: 'Cycle', id: string, name: string } | null, student?: { __typename?: 'Student', id: string, picture: string, fullname: string, code: string } | null, level?: { __typename?: 'Level', id: string, name: string, abbreviation: string } | null };

export type CreateOneEnrollmentMutationVariables = Exact<{
  enrollment: CreateEnrollment;
}>;


export type CreateOneEnrollmentMutation = { __typename?: 'Mutation', createOneEnrollment: { __typename?: 'Enrollment', id: string, details: string, state: EnrollmentState, hours: number, diciplines: number, start: string, end: string, package?: { __typename?: 'Package', id: string, name: string, kind: PackageKind, quantity: number } | null, cycle?: { __typename?: 'Cycle', id: string, name: string } | null, student?: { __typename?: 'Student', id: string, picture: string, fullname: string, code: string } | null, level?: { __typename?: 'Level', id: string, name: string, abbreviation: string } | null } };

export type GetEnrollmentsPageQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<EnrollmentFilter>;
}>;


export type GetEnrollmentsPageQuery = { __typename?: 'Query', enrollments: { __typename?: 'EnrollmentConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'Enrollment', id: string, details: string, state: EnrollmentState, hours: number, diciplines: number, start: string, end: string, package?: { __typename?: 'Package', id: string, name: string, kind: PackageKind, quantity: number } | null, cycle?: { __typename?: 'Cycle', id: string, name: string } | null, student?: { __typename?: 'Student', id: string, picture: string, fullname: string, code: string } | null, level?: { __typename?: 'Level', id: string, name: string, abbreviation: string } | null }> } };

export type UpdateOneEnrollmentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  update: UpdateEnrollment;
}>;


export type UpdateOneEnrollmentMutation = { __typename?: 'Mutation', updateOneEnrollment: { __typename?: 'Enrollment', id: string, details: string, state: EnrollmentState, hours: number, diciplines: number, start: string, end: string, package?: { __typename?: 'Package', id: string, name: string, kind: PackageKind, quantity: number } | null, cycle?: { __typename?: 'Cycle', id: string, name: string } | null, student?: { __typename?: 'Student', id: string, picture: string, fullname: string, code: string } | null, level?: { __typename?: 'Level', id: string, name: string, abbreviation: string } | null } };

export type DeleteOneEnrollmentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOneEnrollmentMutation = { __typename?: 'Mutation', deleteOneEnrollment: { __typename?: 'EnrollmentDeleteResponse', id?: string | null } };

export type SetOrderEnrollmentsMutationVariables = Exact<{
  payload: Array<SetOrderInput> | SetOrderInput;
}>;


export type SetOrderEnrollmentsMutation = { __typename?: 'Mutation', setOrderEnrollments: { __typename?: 'UpdateCount', updatedCount?: number | null } };

export type CurrentEnrollmentPartsFragment = { __typename?: 'Enrollment', id: string, details: string, state: EnrollmentState, hours: number, diciplines: number, start: string, end: string, studentId: string, branchId: string, branch?: { __typename?: 'Branch', id: string, name: string, picture: string } | null, level?: { __typename?: 'Level', id: string, name: string, abbreviation: string } | null };

export type GetCurrentEnrollmentsPageQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<EnrollmentFilter>;
}>;


export type GetCurrentEnrollmentsPageQuery = { __typename?: 'Query', enrollments: { __typename?: 'EnrollmentConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'Enrollment', id: string, details: string, state: EnrollmentState, hours: number, diciplines: number, start: string, end: string, studentId: string, branchId: string, branch?: { __typename?: 'Branch', id: string, name: string, picture: string } | null, level?: { __typename?: 'Level', id: string, name: string, abbreviation: string } | null }> } };

export type FeePartsFragment = { __typename?: 'Fee', id: string, name: string, price: number, amount: number, frequency: Frequency, withTax: boolean, autoLoad: boolean };

export type CreateOneFeeMutationVariables = Exact<{
  fee: CreateFee;
}>;


export type CreateOneFeeMutation = { __typename?: 'Mutation', createOneFee: { __typename?: 'Fee', id: string, name: string, price: number, amount: number, frequency: Frequency, withTax: boolean, autoLoad: boolean } };

export type GetFeePageQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<FeeFilter>;
}>;


export type GetFeePageQuery = { __typename?: 'Query', fees: { __typename?: 'FeeConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'Fee', id: string, name: string, price: number, amount: number, frequency: Frequency, withTax: boolean, autoLoad: boolean }> } };

export type UpdateOneFeeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  update: UpdateFee;
}>;


export type UpdateOneFeeMutation = { __typename?: 'Mutation', updateOneFee: { __typename?: 'Fee', id: string, name: string, price: number, amount: number, frequency: Frequency, withTax: boolean, autoLoad: boolean } };

export type DeleteOneFeeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOneFeeMutation = { __typename?: 'Mutation', deleteOneFee: { __typename?: 'FeeDeleteResponse', id?: string | null } };

export type CreateIncomesMutationVariables = Exact<{
  input: CreateIncome;
}>;


export type CreateIncomesMutation = { __typename?: 'Mutation', createIncomes: Array<{ __typename?: 'Income', id: string, folio: number }> };

export type IncomeWithLinksFragment = { __typename?: 'Income', id: string, folio: number, pendingPayment: number, clipLinks: Array<{ __typename?: 'ClipLink', amount: number, link: string, qr: string, expiresAt: any, requestId: string }> };

export type CreateLinkIncomesMutationVariables = Exact<{
  input: CreateLinkIncome;
}>;


export type CreateLinkIncomesMutation = { __typename?: 'Mutation', createLinkIncomes: Array<{ __typename?: 'Income', id: string, folio: number, pendingPayment: number, clipLinks: Array<{ __typename?: 'ClipLink', amount: number, link: string, qr: string, expiresAt: any, requestId: string }> }> };

export type AccountsReceivablePartsFragment = { __typename?: 'Income', id: string, folio: number, total: number, pendingPayment: number, concepts: Array<{ __typename?: 'Concept', id: string, description: string, unitPrice: number, quantity: number, amount: number, discount: number, subtotal: number, taxes: number, total: number, withTax: boolean, pendingPayment: number, discounts: Array<{ __typename?: 'Discount', id: string, name: string, value: number, type: DiscountBy }> }>, payments: Array<{ __typename?: 'Payment', id: string, folio: number, state: PaymentState, method: PaymentMethod, date: any, amount: number, transaction: string, bank: string }> };

export type GetAccountsReceivableQueryVariables = Exact<{
  input: AccountsReceivable;
}>;


export type GetAccountsReceivableQuery = { __typename?: 'Query', getAccountsReceivable: { __typename?: 'Income', id: string, folio: number, total: number, pendingPayment: number, concepts: Array<{ __typename?: 'Concept', id: string, description: string, unitPrice: number, quantity: number, amount: number, discount: number, subtotal: number, taxes: number, total: number, withTax: boolean, pendingPayment: number, discounts: Array<{ __typename?: 'Discount', id: string, name: string, value: number, type: DiscountBy }> }>, payments: Array<{ __typename?: 'Payment', id: string, folio: number, state: PaymentState, method: PaymentMethod, date: any, amount: number, transaction: string, bank: string }> } };

export type AddPaymentToIncomeMutationVariables = Exact<{
  input: AddPayment;
}>;


export type AddPaymentToIncomeMutation = { __typename?: 'Mutation', addPaymentToIncome: { __typename?: 'Income', id: string, folio: number } };

export type LevelPartsFragment = { __typename?: 'Level', id: string, name: string, abbreviation: string, order: number };

export type CreateOneLevelMutationVariables = Exact<{
  level: CreateLevel;
}>;


export type CreateOneLevelMutation = { __typename?: 'Mutation', createOneLevel: { __typename?: 'Level', id: string, name: string, abbreviation: string, order: number } };

export type GetLevelsPageQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<LevelFilter>;
}>;


export type GetLevelsPageQuery = { __typename?: 'Query', levels: { __typename?: 'LevelConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'Level', id: string, name: string, abbreviation: string, order: number }> } };

export type UpdateOneLevelMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  update: UpdateLevel;
}>;


export type UpdateOneLevelMutation = { __typename?: 'Mutation', updateOneLevel: { __typename?: 'Level', id: string, name: string, abbreviation: string, order: number } };

export type DeleteOneLevelMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOneLevelMutation = { __typename?: 'Mutation', deleteOneLevel: { __typename?: 'LevelDeleteResponse', id?: string | null } };

export type SetOrderLevelsMutationVariables = Exact<{
  payload: Array<SetOrderInput> | SetOrderInput;
}>;


export type SetOrderLevelsMutation = { __typename?: 'Mutation', setOrderLevels: { __typename?: 'UpdateCount', updatedCount?: number | null } };

export type PackagePartsFragment = { __typename?: 'Package', id: string, name: string, quantity: number, kind: PackageKind, withTax: boolean, order: number };

export type CreateOnePackageMutationVariables = Exact<{
  package: CreatePackage;
}>;


export type CreateOnePackageMutation = { __typename?: 'Mutation', createOnePackage: { __typename?: 'Package', id: string, name: string, quantity: number, kind: PackageKind, withTax: boolean, order: number } };

export type GetPackagePageQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<PackageFilter>;
}>;


export type GetPackagePageQuery = { __typename?: 'Query', packages: { __typename?: 'PackageConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'Package', id: string, name: string, quantity: number, kind: PackageKind, withTax: boolean, order: number }> } };

export type UpdateOnePackageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  update: UpdatePackage;
}>;


export type UpdateOnePackageMutation = { __typename?: 'Mutation', updateOnePackage: { __typename?: 'Package', id: string, name: string, quantity: number, kind: PackageKind, withTax: boolean, order: number } };

export type DeleteOnePackageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOnePackageMutation = { __typename?: 'Mutation', deleteOnePackage: { __typename?: 'PackageDeleteResponse', id?: string | null } };

export type SetOrderActivitiesMutationVariables = Exact<{
  payload: Array<SetOrderInput> | SetOrderInput;
}>;


export type SetOrderActivitiesMutation = { __typename?: 'Mutation', setOrderPackages: { __typename?: 'UpdateCount', updatedCount?: number | null } };

export type PeriodPartsFragment = { __typename?: 'Period', id: string, name: string, days: string, start: string, end: string, firstHour: string, lastHour: string };

export type CreateOnePeriodMutationVariables = Exact<{
  period: CreatePeriod;
}>;


export type CreateOnePeriodMutation = { __typename?: 'Mutation', createOnePeriod: { __typename?: 'Period', id: string, name: string, days: string, start: string, end: string, firstHour: string, lastHour: string } };

export type GetPeriodsPageQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<PeriodFilter>;
}>;


export type GetPeriodsPageQuery = { __typename?: 'Query', periods: { __typename?: 'PeriodConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'Period', id: string, name: string, days: string, start: string, end: string, firstHour: string, lastHour: string }> } };

export type UpdateOnePeriodMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  update: UpdatePeriod;
}>;


export type UpdateOnePeriodMutation = { __typename?: 'Mutation', updateOnePeriod: { __typename?: 'Period', id: string, name: string, days: string, start: string, end: string, firstHour: string, lastHour: string } };

export type DeleteOnePeriodMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOnePeriodMutation = { __typename?: 'Mutation', deleteOnePeriod: { __typename?: 'PeriodDeleteResponse', id?: string | null } };

export type SetOrderPeriodsMutationVariables = Exact<{
  payload: Array<SetOrderInput> | SetOrderInput;
}>;


export type SetOrderPeriodsMutation = { __typename?: 'Mutation', setOrderPeriods: { __typename?: 'UpdateCount', updatedCount?: number | null } };

export type PolicyPartsFragment = { __typename?: 'Policy', id: string, name: string, actions: Array<{ __typename?: 'Action', id: string, route: string, actions: Array<string>, resources: string }> };

export type CreateOnePolicyMutationVariables = Exact<{
  policy: CreatePolicy;
}>;


export type CreateOnePolicyMutation = { __typename?: 'Mutation', createOnePolicy: { __typename?: 'Policy', id: string, name: string, actions: Array<{ __typename?: 'Action', id: string, route: string, actions: Array<string>, resources: string }> } };

export type GetPoliciesPageQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<PolicyFilter>;
}>;


export type GetPoliciesPageQuery = { __typename?: 'Query', policies: { __typename?: 'PolicyConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'Policy', id: string, name: string, actions: Array<{ __typename?: 'Action', id: string, route: string, actions: Array<string>, resources: string }> }> } };

export type UpdateOnePolicyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  update: UpdatePolicy;
}>;


export type UpdateOnePolicyMutation = { __typename?: 'Mutation', updateOnePolicy: { __typename?: 'Policy', id: string, name: string, actions: Array<{ __typename?: 'Action', id: string, route: string, actions: Array<string>, resources: string }> } };

export type DeleteOnePolicyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOnePolicyMutation = { __typename?: 'Mutation', deleteOnePolicy: { __typename?: 'PolicyDeleteResponse', id?: string | null } };

export type SchedulePartsFragment = { __typename?: 'Schedule', id: string, day: number, start: string, end: string, levels?: Array<{ __typename?: 'Level', id: string, abbreviation: string }> | null, teacher?: { __typename?: 'Teacher', id: string, fullname: string, picture: string } | null, discipline?: { __typename?: 'Discipline', id: string, name: string, minHours: number } | null, enrollments: { __typename?: 'ScheduleEnrollmentsConnection', totalCount: number } };

export type CreateOneScheduleMutationVariables = Exact<{
  schedule: CreateSchedule;
}>;


export type CreateOneScheduleMutation = { __typename?: 'Mutation', createOneSchedule: { __typename?: 'Schedule', id: string, day: number, start: string, end: string, levels?: Array<{ __typename?: 'Level', id: string, abbreviation: string }> | null, teacher?: { __typename?: 'Teacher', id: string, fullname: string, picture: string } | null, discipline?: { __typename?: 'Discipline', id: string, name: string, minHours: number } | null, enrollments: { __typename?: 'ScheduleEnrollmentsConnection', totalCount: number } } };

export type GetSchedulesPageQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<ScheduleFilter>;
}>;


export type GetSchedulesPageQuery = { __typename?: 'Query', schedules: { __typename?: 'ScheduleConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'Schedule', id: string, day: number, start: string, end: string, levels?: Array<{ __typename?: 'Level', id: string, abbreviation: string }> | null, teacher?: { __typename?: 'Teacher', id: string, fullname: string, picture: string } | null, discipline?: { __typename?: 'Discipline', id: string, name: string, minHours: number } | null, enrollments: { __typename?: 'ScheduleEnrollmentsConnection', totalCount: number } }> } };

export type UpdateOneScheduleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  update: UpdateSchedule;
}>;


export type UpdateOneScheduleMutation = { __typename?: 'Mutation', updateOneSchedule: { __typename?: 'Schedule', id: string, day: number, start: string, end: string, levels?: Array<{ __typename?: 'Level', id: string, abbreviation: string }> | null, teacher?: { __typename?: 'Teacher', id: string, fullname: string, picture: string } | null, discipline?: { __typename?: 'Discipline', id: string, name: string, minHours: number } | null, enrollments: { __typename?: 'ScheduleEnrollmentsConnection', totalCount: number } } };

export type DeleteOneScheduleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOneScheduleMutation = { __typename?: 'Mutation', deleteOneSchedule: { __typename?: 'ScheduleDeleteResponse', id?: string | null } };

export type StudentPartsFragment = { __typename?: 'Student', id: string, code: string, picture: string, fullname: string, firstname: string, lastname: string, dateBirth: string, active: boolean, dni: string, branchs: Array<{ __typename?: 'Branch', id: string }> };

export type CreateOneStudentMutationVariables = Exact<{
  student: CreateStudent;
}>;


export type CreateOneStudentMutation = { __typename?: 'Mutation', createOneStudent: { __typename?: 'Student', id: string, code: string, picture: string, fullname: string, firstname: string, lastname: string, dateBirth: string, active: boolean, dni: string, branchs: Array<{ __typename?: 'Branch', id: string }> } };

export type GetStudentsPageQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<StudentFilter>;
}>;


export type GetStudentsPageQuery = { __typename?: 'Query', students: { __typename?: 'StudentConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'Student', id: string, code: string, picture: string, fullname: string, firstname: string, lastname: string, dateBirth: string, active: boolean, dni: string, branchs: Array<{ __typename?: 'Branch', id: string }> }> } };

export type FetchStudentQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<StudentFilter>;
}>;


export type FetchStudentQuery = { __typename?: 'Query', students: { __typename?: 'StudentConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'Student', id: string, code: string, picture: string, fullname: string, firstname: string, lastname: string, dateBirth: string, active: boolean, dni: string, branchs: Array<{ __typename?: 'Branch', id: string }> }> } };

export type UpdateOneStudentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  update: UpdateStudent;
}>;


export type UpdateOneStudentMutation = { __typename?: 'Mutation', updateOneStudent: { __typename?: 'Student', id: string, code: string, picture: string, fullname: string, firstname: string, lastname: string, dateBirth: string, active: boolean, dni: string, branchs: Array<{ __typename?: 'Branch', id: string }> } };

export type DeleteOneStudentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOneStudentMutation = { __typename?: 'Mutation', deleteOneStudent: { __typename?: 'StudentDeleteResponse', id?: string | null } };

export type DocumentPartsFragment = { __typename?: 'Document', id: string, name: string, key: string, url: string };

export type GetDocumentPageQueryVariables = Exact<{
  studentId: Scalars['ID']['input'];
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetDocumentPageQuery = { __typename?: 'Query', documents: { __typename?: 'DocumentConnection', totalCount: number, nodes: Array<{ __typename?: 'Document', id: string, name: string, key: string, url: string }> } };

export type CreateOneDocumentMutationVariables = Exact<{
  document: CreateDocument;
}>;


export type CreateOneDocumentMutation = { __typename?: 'Mutation', createOneDocument: { __typename?: 'Document', id: string, name: string, key: string, url: string } };

export type AddStudentsToDocumentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  relationIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type AddStudentsToDocumentMutation = { __typename?: 'Mutation', addStudentsToDocument: { __typename?: 'Document', id: string } };

export type RemoveStudentsFromDocumentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  relationIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type RemoveStudentsFromDocumentMutation = { __typename?: 'Mutation', removeStudentsFromDocument: { __typename?: 'Document', id: string } };

export type DeleteOneDocumentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOneDocumentMutation = { __typename?: 'Mutation', deleteOneDocument: { __typename?: 'DocumentDeleteResponse', id?: string | null } };

export type TeacherPartsFragment = { __typename?: 'Teacher', id: string, picture: string, fullname: string, firstname: string, lastname: string, branchs: Array<{ __typename?: 'Branch', id: string, name: string }> };

export type CreateOneTeacherMutationVariables = Exact<{
  teacher: CreateTeacher;
}>;


export type CreateOneTeacherMutation = { __typename?: 'Mutation', createOneTeacher: { __typename?: 'Teacher', id: string, picture: string, fullname: string, firstname: string, lastname: string, branchs: Array<{ __typename?: 'Branch', id: string, name: string }> } };

export type GetTeachersPageQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<TeacherFilter>;
}>;


export type GetTeachersPageQuery = { __typename?: 'Query', teachers: { __typename?: 'TeacherConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'Teacher', id: string, picture: string, fullname: string, firstname: string, lastname: string, branchs: Array<{ __typename?: 'Branch', id: string, name: string }> }> } };

export type FetchTeacherQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<TeacherFilter>;
}>;


export type FetchTeacherQuery = { __typename?: 'Query', teachers: { __typename?: 'TeacherConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'Teacher', id: string, picture: string, fullname: string, firstname: string, lastname: string, branchs: Array<{ __typename?: 'Branch', id: string, name: string }> }> } };

export type UpdateOneTeacherMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  update: UpdateTeacher;
}>;


export type UpdateOneTeacherMutation = { __typename?: 'Mutation', updateOneTeacher: { __typename?: 'Teacher', id: string, picture: string, fullname: string, firstname: string, lastname: string, branchs: Array<{ __typename?: 'Branch', id: string, name: string }> } };

export type DeleteOneTeacherMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOneTeacherMutation = { __typename?: 'Mutation', deleteOneTeacher: { __typename?: 'TeacherDeleteResponse', id?: string | null } };

export type UserPartsFragment = { __typename?: 'User', id: string, username: string, email: string, branchId: string, cycleId: string };

export type GetUsersPageQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<UserFilter>;
}>;


export type GetUsersPageQuery = { __typename?: 'Query', users: { __typename?: 'UserConnection', totalCount: number, pageInfo: { __typename?: 'OffsetPageInfo', hasNextPage?: boolean | null, hasPreviousPage?: boolean | null }, nodes: Array<{ __typename?: 'User', id: string, username: string, email: string, branchId: string, cycleId: string }> } };

export type CreateOneUserMutationVariables = Exact<{
  input: SignUpInput;
}>;


export type CreateOneUserMutation = { __typename?: 'Mutation', signUp: { __typename?: 'Session', id: string, username: string } };

export type UpdateOneUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  update: UpdateUser;
}>;


export type UpdateOneUserMutation = { __typename?: 'Mutation', updateOneUser: { __typename?: 'User', id: string } };

export type DeleteOneUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOneUserMutation = { __typename?: 'Mutation', deleteOneUser: { __typename?: 'UserDeleteResponse', id?: string | null, username?: string | null } };

export type GetUserPoliciesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserPoliciesQuery = { __typename?: 'Query', user: { __typename?: 'User', policies: Array<{ __typename?: 'Policy', id: string }> } };

export const SessionPartsFragmentDoc = gql`
    fragment SessionParts on Session {
  id
  token
  username
  branch {
    id
    picture
    name
  }
  cycle {
    id
    name
    start
    end
  }
  exp
  iat
}
    `;
export const ClipAccountPartsFragmentDoc = gql`
    fragment ClipAccountParts on ClipAccount {
  id
  name
  webhook
  deletedAt
  success
  error
  default
}
    `;
export const BranchPartsFragmentDoc = gql`
    fragment BranchParts on Branch {
  id
  name
  picture
  clipAccounts {
    id
    name
  }
}
    `;
export const CyclePartsFragmentDoc = gql`
    fragment CycleParts on Cycle {
  id
  name
  start
  end
}
    `;
export const DebitPartsFragmentDoc = gql`
    fragment DebitParts on Debit {
  id
  description
  unitPrice
  quantity
  amount
  discount
  subtotal
  taxes
  total
  withTax
  state
  frequency
  delinquency
  dueDate
  paymentDate
  concepts(
    filter: {application: {eq: DEBT_PAYMENT}, pendingPayment: {gt: 0}, income: {state: {neq: CANCELLED}}}
    sorting: [{direction: DESC, field: createdAt}]
  ) {
    pendingPayment
  }
  discounts {
    id
    name
    value
    type
  }
}
    `;
export const DisciplinePartsFragmentDoc = gql`
    fragment DisciplineParts on Discipline {
  id
  name
  minHours
  packages {
    id
    name
    kind
  }
}
    `;
export const DiscountPartsFragmentDoc = gql`
    fragment DiscountParts on Discount {
  id
  name
  value
  type
}
    `;
export const EnrollmentPartsFragmentDoc = gql`
    fragment EnrollmentParts on Enrollment {
  id
  details
  state
  hours
  diciplines
  start
  end
  package {
    id
    name
    kind
    quantity
  }
  cycle {
    id
    name
  }
  student {
    id
    picture
    fullname
    code
  }
  level {
    id
    name
    abbreviation
  }
}
    `;
export const CurrentEnrollmentPartsFragmentDoc = gql`
    fragment CurrentEnrollmentParts on Enrollment {
  id
  details
  state
  hours
  diciplines
  start
  end
  studentId
  branchId
  branch {
    id
    name
    picture
  }
  level {
    id
    name
    abbreviation
  }
}
    `;
export const FeePartsFragmentDoc = gql`
    fragment FeeParts on Fee {
  id
  name
  price
  amount
  frequency
  withTax
  autoLoad
}
    `;
export const IncomeWithLinksFragmentDoc = gql`
    fragment IncomeWithLinks on Income {
  id
  folio
  pendingPayment
  clipLinks {
    amount
    link
    qr
    expiresAt
    requestId
  }
}
    `;
export const AccountsReceivablePartsFragmentDoc = gql`
    fragment AccountsReceivableParts on Income {
  id
  folio
  total
  pendingPayment
  concepts {
    id
    description
    unitPrice
    quantity
    amount
    discount
    subtotal
    taxes
    total
    withTax
    pendingPayment
    discounts {
      id
      name
      value
      type
    }
  }
  payments {
    id
    folio
    state
    method
    date
    amount
    transaction
    bank
  }
}
    `;
export const LevelPartsFragmentDoc = gql`
    fragment LevelParts on Level {
  id
  name
  abbreviation
  order
}
    `;
export const PackagePartsFragmentDoc = gql`
    fragment PackageParts on Package {
  id
  name
  quantity
  kind
  withTax
  order
}
    `;
export const PeriodPartsFragmentDoc = gql`
    fragment PeriodParts on Period {
  id
  name
  days
  start
  end
  firstHour
  lastHour
}
    `;
export const PolicyPartsFragmentDoc = gql`
    fragment PolicyParts on Policy {
  id
  name
  actions {
    id
    route
    actions
    resources
  }
}
    `;
export const SchedulePartsFragmentDoc = gql`
    fragment ScheduleParts on Schedule {
  id
  day
  start
  end
  levels {
    id
    abbreviation
  }
  teacher {
    id
    fullname
    picture
  }
  discipline {
    id
    name
    minHours
  }
  enrollments {
    totalCount
  }
}
    `;
export const StudentPartsFragmentDoc = gql`
    fragment StudentParts on Student {
  id
  code
  picture
  fullname
  firstname
  lastname
  dateBirth
  active
  branchs {
    id
  }
  dni
}
    `;
export const DocumentPartsFragmentDoc = gql`
    fragment DocumentParts on Document {
  id
  name
  key
  url
}
    `;
export const TeacherPartsFragmentDoc = gql`
    fragment TeacherParts on Teacher {
  id
  picture
  fullname
  firstname
  lastname
  branchs {
    id
    name
  }
}
    `;
export const UserPartsFragmentDoc = gql`
    fragment UserParts on User {
  id
  username
  email
  branchId
  cycleId
}
    `;
export const SignInDocument = gql`
    mutation signIn($input: SignInInput!) {
  signIn(input: $input) {
    ...SessionParts
  }
}
    ${SessionPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class SignInGQL extends Apollo.Mutation<SignInMutation, SignInMutationVariables> {
    document = SignInDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SignUpDocument = gql`
    mutation signUp($input: SignUpInput!) {
  signUp(input: $input) {
    ...SessionParts
  }
}
    ${SessionPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class SignUpGQL extends Apollo.Mutation<SignUpMutation, SignUpMutationVariables> {
    document = SignUpDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOneClipAccountDocument = gql`
    mutation createOneClipAccount($account: CreateClipAccount!) {
  createOneClipAccount(input: {clipAccount: $account}) {
    ...ClipAccountParts
  }
}
    ${ClipAccountPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOneClipAccountGQL extends Apollo.Mutation<CreateOneClipAccountMutation, CreateOneClipAccountMutationVariables> {
    document = CreateOneClipAccountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetClipAccountsPageDocument = gql`
    query getClipAccountsPage($offset: Int = 0, $limit: Int = 10, $filter: ClipAccountFilter = {}) {
  clipAccounts(paging: {limit: $limit, offset: $offset}, filter: $filter) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...ClipAccountParts
    }
  }
}
    ${ClipAccountPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetClipAccountsPageGQL extends Apollo.Query<GetClipAccountsPageQuery, GetClipAccountsPageQueryVariables> {
    document = GetClipAccountsPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOneClipAccountDocument = gql`
    mutation updateOneClipAccount($id: ID!, $update: UpdateClipAccount!) {
  updateOneClipAccount(input: {id: $id, update: $update}) {
    ...ClipAccountParts
  }
}
    ${ClipAccountPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOneClipAccountGQL extends Apollo.Mutation<UpdateOneClipAccountMutation, UpdateOneClipAccountMutationVariables> {
    document = UpdateOneClipAccountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOneClipAccountDocument = gql`
    mutation deleteOneClipAccount($id: ID!) {
  deleteOneClipAccount(input: {id: $id}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteOneClipAccountGQL extends Apollo.Mutation<DeleteOneClipAccountMutation, DeleteOneClipAccountMutationVariables> {
    document = DeleteOneClipAccountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOneBranchDocument = gql`
    mutation createOneBranch($branch: CreateBranch!) {
  createOneBranch(input: {branch: $branch}) {
    ...BranchParts
  }
}
    ${BranchPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOneBranchGQL extends Apollo.Mutation<CreateOneBranchMutation, CreateOneBranchMutationVariables> {
    document = CreateOneBranchDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetCompaniesPageDocument = gql`
    query getCompaniesPage($offset: Int = 0, $limit: Int = 10, $filter: BranchFilter = {}) {
  branches(paging: {limit: $limit, offset: $offset}, filter: $filter) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...BranchParts
    }
  }
}
    ${BranchPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetCompaniesPageGQL extends Apollo.Query<GetCompaniesPageQuery, GetCompaniesPageQueryVariables> {
    document = GetCompaniesPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOneBranchDocument = gql`
    mutation updateOneBranch($id: ID!, $update: UpdateBranch!) {
  updateOneBranch(input: {id: $id, update: $update}) {
    ...BranchParts
  }
}
    ${BranchPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOneBranchGQL extends Apollo.Mutation<UpdateOneBranchMutation, UpdateOneBranchMutationVariables> {
    document = UpdateOneBranchDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOneBranchDocument = gql`
    mutation deleteOneBranch($id: ID!) {
  deleteOneBranch(input: {id: $id}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteOneBranchGQL extends Apollo.Mutation<DeleteOneBranchMutation, DeleteOneBranchMutationVariables> {
    document = DeleteOneBranchDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOneCycleDocument = gql`
    mutation createOneCycle($cycle: CreateCycle!) {
  createOneCycle(input: {cycle: $cycle}) {
    ...CycleParts
  }
}
    ${CyclePartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOneCycleGQL extends Apollo.Mutation<CreateOneCycleMutation, CreateOneCycleMutationVariables> {
    document = CreateOneCycleDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetCyclesPageDocument = gql`
    query getCyclesPage($offset: Int = 0, $limit: Int = 10, $filter: CycleFilter = {}) {
  cycles(paging: {limit: $limit, offset: $offset}, filter: $filter) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...CycleParts
    }
  }
}
    ${CyclePartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetCyclesPageGQL extends Apollo.Query<GetCyclesPageQuery, GetCyclesPageQueryVariables> {
    document = GetCyclesPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOneCycleDocument = gql`
    mutation updateOneCycle($id: ID!, $update: UpdateCycle!) {
  updateOneCycle(input: {id: $id, update: $update}) {
    ...CycleParts
  }
}
    ${CyclePartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOneCycleGQL extends Apollo.Mutation<UpdateOneCycleMutation, UpdateOneCycleMutationVariables> {
    document = UpdateOneCycleDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOneCycleDocument = gql`
    mutation deleteOneCycle($id: ID!) {
  deleteOneCycle(input: {id: $id}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteOneCycleGQL extends Apollo.Mutation<DeleteOneCycleMutation, DeleteOneCycleMutationVariables> {
    document = DeleteOneCycleDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOneDebitDocument = gql`
    mutation createOneDebit($debit: CreateDebit!) {
  createOneDebit(input: {debit: $debit}) {
    ...DebitParts
  }
}
    ${DebitPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOneDebitGQL extends Apollo.Mutation<CreateOneDebitMutation, CreateOneDebitMutationVariables> {
    document = CreateOneDebitDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetDebitsPageDocument = gql`
    query getDebitsPage($offset: Int = 0, $limit: Int = 10, $filter: DebitFilter = {}) {
  debits(
    paging: {limit: $limit, offset: $offset}
    sorting: {field: dueDate, direction: ASC}
    filter: $filter
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...DebitParts
    }
  }
}
    ${DebitPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetDebitsPageGQL extends Apollo.Query<GetDebitsPageQuery, GetDebitsPageQueryVariables> {
    document = GetDebitsPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOneDebitDocument = gql`
    mutation updateOneDebit($id: ID!, $update: UpdateDebit!) {
  updateOneDebit(input: {id: $id, update: $update}) {
    ...DebitParts
  }
}
    ${DebitPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOneDebitGQL extends Apollo.Mutation<UpdateOneDebitMutation, UpdateOneDebitMutationVariables> {
    document = UpdateOneDebitDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateManyDebitsDocument = gql`
    mutation createManyDebits($debits: [CreateDebit!]!) {
  createManyDebits(input: {debits: $debits}) {
    ...DebitParts
  }
}
    ${DebitPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateManyDebitsGQL extends Apollo.Mutation<CreateManyDebitsMutation, CreateManyDebitsMutationVariables> {
    document = CreateManyDebitsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOneDebitDocument = gql`
    mutation deleteOneDebit($id: ID!) {
  deleteOneDebit(input: {id: $id}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteOneDebitGQL extends Apollo.Mutation<DeleteOneDebitMutation, DeleteOneDebitMutationVariables> {
    document = DeleteOneDebitDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOneDisciplineDocument = gql`
    mutation createOneDiscipline($discipline: CreateDiscipline!) {
  createOneDiscipline(input: {discipline: $discipline}) {
    ...DisciplineParts
  }
}
    ${DisciplinePartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOneDisciplineGQL extends Apollo.Mutation<CreateOneDisciplineMutation, CreateOneDisciplineMutationVariables> {
    document = CreateOneDisciplineDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetDisciplinesPageDocument = gql`
    query getDisciplinesPage($offset: Int = 0, $limit: Int = 10, $filter: DisciplineFilter = {}) {
  disciplines(paging: {limit: $limit, offset: $offset}, filter: $filter) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...DisciplineParts
    }
  }
}
    ${DisciplinePartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetDisciplinesPageGQL extends Apollo.Query<GetDisciplinesPageQuery, GetDisciplinesPageQueryVariables> {
    document = GetDisciplinesPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOneDisciplineDocument = gql`
    mutation updateOneDiscipline($id: ID!, $update: UpdateDiscipline!) {
  updateOneDiscipline(input: {id: $id, update: $update}) {
    ...DisciplineParts
  }
}
    ${DisciplinePartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOneDisciplineGQL extends Apollo.Mutation<UpdateOneDisciplineMutation, UpdateOneDisciplineMutationVariables> {
    document = UpdateOneDisciplineDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOneDisciplineDocument = gql`
    mutation deleteOneDiscipline($id: ID!) {
  deleteOneDiscipline(input: {id: $id}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteOneDisciplineGQL extends Apollo.Mutation<DeleteOneDisciplineMutation, DeleteOneDisciplineMutationVariables> {
    document = DeleteOneDisciplineDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOneDiscountDocument = gql`
    mutation createOneDiscount($discount: CreateDiscount!) {
  createOneDiscount(input: {discount: $discount}) {
    ...DiscountParts
  }
}
    ${DiscountPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOneDiscountGQL extends Apollo.Mutation<CreateOneDiscountMutation, CreateOneDiscountMutationVariables> {
    document = CreateOneDiscountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetDiscountsPageDocument = gql`
    query getDiscountsPage($offset: Int = 0, $limit: Int = 10, $filter: DiscountFilter = {}) {
  discounts(paging: {limit: $limit, offset: $offset}, filter: $filter) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...DiscountParts
    }
  }
}
    ${DiscountPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetDiscountsPageGQL extends Apollo.Query<GetDiscountsPageQuery, GetDiscountsPageQueryVariables> {
    document = GetDiscountsPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOneDiscountDocument = gql`
    mutation updateOneDiscount($id: ID!, $update: UpdateDiscount!) {
  updateOneDiscount(input: {id: $id, update: $update}) {
    ...DiscountParts
  }
}
    ${DiscountPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOneDiscountGQL extends Apollo.Mutation<UpdateOneDiscountMutation, UpdateOneDiscountMutationVariables> {
    document = UpdateOneDiscountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOneDiscountDocument = gql`
    mutation deleteOneDiscount($id: ID!) {
  deleteOneDiscount(input: {id: $id}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteOneDiscountGQL extends Apollo.Mutation<DeleteOneDiscountMutation, DeleteOneDiscountMutationVariables> {
    document = DeleteOneDiscountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOneEnrollmentDocument = gql`
    mutation createOneEnrollment($enrollment: CreateEnrollment!) {
  createOneEnrollment(input: {enrollment: $enrollment}) {
    ...EnrollmentParts
  }
}
    ${EnrollmentPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOneEnrollmentGQL extends Apollo.Mutation<CreateOneEnrollmentMutation, CreateOneEnrollmentMutationVariables> {
    document = CreateOneEnrollmentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetEnrollmentsPageDocument = gql`
    query getEnrollmentsPage($offset: Int = 0, $limit: Int = 10, $filter: EnrollmentFilter = {}) {
  enrollments(
    paging: {limit: $limit, offset: $offset}
    filter: $filter
    sorting: [{field: order, direction: ASC}, {field: createdAt, direction: DESC}]
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...EnrollmentParts
    }
  }
}
    ${EnrollmentPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetEnrollmentsPageGQL extends Apollo.Query<GetEnrollmentsPageQuery, GetEnrollmentsPageQueryVariables> {
    document = GetEnrollmentsPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOneEnrollmentDocument = gql`
    mutation updateOneEnrollment($id: ID!, $update: UpdateEnrollment!) {
  updateOneEnrollment(input: {id: $id, update: $update}) {
    ...EnrollmentParts
  }
}
    ${EnrollmentPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOneEnrollmentGQL extends Apollo.Mutation<UpdateOneEnrollmentMutation, UpdateOneEnrollmentMutationVariables> {
    document = UpdateOneEnrollmentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOneEnrollmentDocument = gql`
    mutation deleteOneEnrollment($id: ID!) {
  deleteOneEnrollment(input: {id: $id}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteOneEnrollmentGQL extends Apollo.Mutation<DeleteOneEnrollmentMutation, DeleteOneEnrollmentMutationVariables> {
    document = DeleteOneEnrollmentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SetOrderEnrollmentsDocument = gql`
    mutation setOrderEnrollments($payload: [SetOrderInput!]!) {
  setOrderEnrollments(input: $payload) {
    updatedCount
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SetOrderEnrollmentsGQL extends Apollo.Mutation<SetOrderEnrollmentsMutation, SetOrderEnrollmentsMutationVariables> {
    document = SetOrderEnrollmentsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetCurrentEnrollmentsPageDocument = gql`
    query getCurrentEnrollmentsPage($offset: Int = 0, $limit: Int = 10, $filter: EnrollmentFilter = {}) {
  enrollments(
    paging: {limit: $limit, offset: $offset}
    filter: $filter
    sorting: [{field: order, direction: ASC}, {field: createdAt, direction: DESC}]
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...CurrentEnrollmentParts
    }
  }
}
    ${CurrentEnrollmentPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetCurrentEnrollmentsPageGQL extends Apollo.Query<GetCurrentEnrollmentsPageQuery, GetCurrentEnrollmentsPageQueryVariables> {
    document = GetCurrentEnrollmentsPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOneFeeDocument = gql`
    mutation createOneFee($fee: CreateFee!) {
  createOneFee(input: {fee: $fee}) {
    ...FeeParts
  }
}
    ${FeePartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOneFeeGQL extends Apollo.Mutation<CreateOneFeeMutation, CreateOneFeeMutationVariables> {
    document = CreateOneFeeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetFeePageDocument = gql`
    query getFeePage($offset: Int = 0, $limit: Int = 10, $filter: FeeFilter = {}) {
  fees(paging: {limit: $limit, offset: $offset}, filter: $filter) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...FeeParts
    }
  }
}
    ${FeePartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetFeePageGQL extends Apollo.Query<GetFeePageQuery, GetFeePageQueryVariables> {
    document = GetFeePageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOneFeeDocument = gql`
    mutation updateOneFee($id: ID!, $update: UpdateFee!) {
  updateOneFee(input: {id: $id, update: $update}) {
    ...FeeParts
  }
}
    ${FeePartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOneFeeGQL extends Apollo.Mutation<UpdateOneFeeMutation, UpdateOneFeeMutationVariables> {
    document = UpdateOneFeeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOneFeeDocument = gql`
    mutation deleteOneFee($id: ID!) {
  deleteOneFee(input: {id: $id}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteOneFeeGQL extends Apollo.Mutation<DeleteOneFeeMutation, DeleteOneFeeMutationVariables> {
    document = DeleteOneFeeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateIncomesDocument = gql`
    mutation createIncomes($input: CreateIncome!) {
  createIncomes(input: $input) {
    id
    folio
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateIncomesGQL extends Apollo.Mutation<CreateIncomesMutation, CreateIncomesMutationVariables> {
    document = CreateIncomesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateLinkIncomesDocument = gql`
    mutation createLinkIncomes($input: CreateLinkIncome!) {
  createLinkIncomes(input: $input) {
    ...IncomeWithLinks
  }
}
    ${IncomeWithLinksFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateLinkIncomesGQL extends Apollo.Mutation<CreateLinkIncomesMutation, CreateLinkIncomesMutationVariables> {
    document = CreateLinkIncomesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetAccountsReceivableDocument = gql`
    query getAccountsReceivable($input: AccountsReceivable!) {
  getAccountsReceivable(input: $input) {
    ...AccountsReceivableParts
  }
}
    ${AccountsReceivablePartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAccountsReceivableGQL extends Apollo.Query<GetAccountsReceivableQuery, GetAccountsReceivableQueryVariables> {
    document = GetAccountsReceivableDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddPaymentToIncomeDocument = gql`
    mutation addPaymentToIncome($input: AddPayment!) {
  addPaymentToIncome(input: $input) {
    id
    folio
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddPaymentToIncomeGQL extends Apollo.Mutation<AddPaymentToIncomeMutation, AddPaymentToIncomeMutationVariables> {
    document = AddPaymentToIncomeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOneLevelDocument = gql`
    mutation createOneLevel($level: CreateLevel!) {
  createOneLevel(input: {level: $level}) {
    ...LevelParts
  }
}
    ${LevelPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOneLevelGQL extends Apollo.Mutation<CreateOneLevelMutation, CreateOneLevelMutationVariables> {
    document = CreateOneLevelDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetLevelsPageDocument = gql`
    query getLevelsPage($offset: Int = 0, $limit: Int = 10, $filter: LevelFilter = {}) {
  levels(
    paging: {limit: $limit, offset: $offset}
    sorting: [{field: order, direction: ASC}, {field: createdAt, direction: DESC}]
    filter: $filter
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...LevelParts
    }
  }
}
    ${LevelPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetLevelsPageGQL extends Apollo.Query<GetLevelsPageQuery, GetLevelsPageQueryVariables> {
    document = GetLevelsPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOneLevelDocument = gql`
    mutation updateOneLevel($id: ID!, $update: UpdateLevel!) {
  updateOneLevel(input: {id: $id, update: $update}) {
    ...LevelParts
  }
}
    ${LevelPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOneLevelGQL extends Apollo.Mutation<UpdateOneLevelMutation, UpdateOneLevelMutationVariables> {
    document = UpdateOneLevelDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOneLevelDocument = gql`
    mutation deleteOneLevel($id: ID!) {
  deleteOneLevel(input: {id: $id}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteOneLevelGQL extends Apollo.Mutation<DeleteOneLevelMutation, DeleteOneLevelMutationVariables> {
    document = DeleteOneLevelDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SetOrderLevelsDocument = gql`
    mutation setOrderLevels($payload: [SetOrderInput!]!) {
  setOrderLevels(input: $payload) {
    updatedCount
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SetOrderLevelsGQL extends Apollo.Mutation<SetOrderLevelsMutation, SetOrderLevelsMutationVariables> {
    document = SetOrderLevelsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOnePackageDocument = gql`
    mutation createOnePackage($package: CreatePackage!) {
  createOnePackage(input: {package: $package}) {
    ...PackageParts
  }
}
    ${PackagePartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOnePackageGQL extends Apollo.Mutation<CreateOnePackageMutation, CreateOnePackageMutationVariables> {
    document = CreateOnePackageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPackagePageDocument = gql`
    query getPackagePage($offset: Int = 0, $limit: Int = 10, $filter: PackageFilter = {}) {
  packages(
    paging: {limit: $limit, offset: $offset}
    sorting: [{field: order, direction: ASC}, {field: createdAt, direction: DESC}]
    filter: $filter
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...PackageParts
    }
  }
}
    ${PackagePartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPackagePageGQL extends Apollo.Query<GetPackagePageQuery, GetPackagePageQueryVariables> {
    document = GetPackagePageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOnePackageDocument = gql`
    mutation updateOnePackage($id: ID!, $update: UpdatePackage!) {
  updateOnePackage(input: {id: $id, update: $update}) {
    ...PackageParts
  }
}
    ${PackagePartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOnePackageGQL extends Apollo.Mutation<UpdateOnePackageMutation, UpdateOnePackageMutationVariables> {
    document = UpdateOnePackageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOnePackageDocument = gql`
    mutation deleteOnePackage($id: ID!) {
  deleteOnePackage(input: {id: $id}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteOnePackageGQL extends Apollo.Mutation<DeleteOnePackageMutation, DeleteOnePackageMutationVariables> {
    document = DeleteOnePackageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SetOrderActivitiesDocument = gql`
    mutation setOrderActivities($payload: [SetOrderInput!]!) {
  setOrderPackages(input: $payload) {
    updatedCount
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SetOrderActivitiesGQL extends Apollo.Mutation<SetOrderActivitiesMutation, SetOrderActivitiesMutationVariables> {
    document = SetOrderActivitiesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOnePeriodDocument = gql`
    mutation createOnePeriod($period: CreatePeriod!) {
  createOnePeriod(input: {period: $period}) {
    ...PeriodParts
  }
}
    ${PeriodPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOnePeriodGQL extends Apollo.Mutation<CreateOnePeriodMutation, CreateOnePeriodMutationVariables> {
    document = CreateOnePeriodDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPeriodsPageDocument = gql`
    query getPeriodsPage($offset: Int = 0, $limit: Int = 10, $filter: PeriodFilter = {}) {
  periods(
    paging: {limit: $limit, offset: $offset}
    sorting: [{field: order, direction: ASC}, {field: createdAt, direction: DESC}]
    filter: $filter
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...PeriodParts
    }
  }
}
    ${PeriodPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPeriodsPageGQL extends Apollo.Query<GetPeriodsPageQuery, GetPeriodsPageQueryVariables> {
    document = GetPeriodsPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOnePeriodDocument = gql`
    mutation updateOnePeriod($id: ID!, $update: UpdatePeriod!) {
  updateOnePeriod(input: {id: $id, update: $update}) {
    ...PeriodParts
  }
}
    ${PeriodPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOnePeriodGQL extends Apollo.Mutation<UpdateOnePeriodMutation, UpdateOnePeriodMutationVariables> {
    document = UpdateOnePeriodDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOnePeriodDocument = gql`
    mutation deleteOnePeriod($id: ID!) {
  deleteOnePeriod(input: {id: $id}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteOnePeriodGQL extends Apollo.Mutation<DeleteOnePeriodMutation, DeleteOnePeriodMutationVariables> {
    document = DeleteOnePeriodDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SetOrderPeriodsDocument = gql`
    mutation setOrderPeriods($payload: [SetOrderInput!]!) {
  setOrderPeriods(input: $payload) {
    updatedCount
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SetOrderPeriodsGQL extends Apollo.Mutation<SetOrderPeriodsMutation, SetOrderPeriodsMutationVariables> {
    document = SetOrderPeriodsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOnePolicyDocument = gql`
    mutation createOnePolicy($policy: CreatePolicy!) {
  createOnePolicy(input: {policy: $policy}) {
    ...PolicyParts
  }
}
    ${PolicyPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOnePolicyGQL extends Apollo.Mutation<CreateOnePolicyMutation, CreateOnePolicyMutationVariables> {
    document = CreateOnePolicyDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPoliciesPageDocument = gql`
    query getPoliciesPage($offset: Int = 0, $limit: Int = 10, $filter: PolicyFilter = {}) {
  policies(
    paging: {limit: $limit, offset: $offset}
    sorting: [{field: createdAt, direction: DESC}]
    filter: $filter
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...PolicyParts
    }
  }
}
    ${PolicyPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPoliciesPageGQL extends Apollo.Query<GetPoliciesPageQuery, GetPoliciesPageQueryVariables> {
    document = GetPoliciesPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOnePolicyDocument = gql`
    mutation updateOnePolicy($id: ID!, $update: UpdatePolicy!) {
  updateOnePolicy(input: {id: $id, update: $update}) {
    ...PolicyParts
  }
}
    ${PolicyPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOnePolicyGQL extends Apollo.Mutation<UpdateOnePolicyMutation, UpdateOnePolicyMutationVariables> {
    document = UpdateOnePolicyDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOnePolicyDocument = gql`
    mutation deleteOnePolicy($id: ID!) {
  deleteOnePolicy(input: {id: $id}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteOnePolicyGQL extends Apollo.Mutation<DeleteOnePolicyMutation, DeleteOnePolicyMutationVariables> {
    document = DeleteOnePolicyDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOneScheduleDocument = gql`
    mutation createOneSchedule($schedule: CreateSchedule!) {
  createOneSchedule(input: {schedule: $schedule}) {
    ...ScheduleParts
  }
}
    ${SchedulePartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOneScheduleGQL extends Apollo.Mutation<CreateOneScheduleMutation, CreateOneScheduleMutationVariables> {
    document = CreateOneScheduleDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetSchedulesPageDocument = gql`
    query getSchedulesPage($offset: Int = 0, $limit: Int = 10, $filter: ScheduleFilter = {}) {
  schedules(paging: {limit: $limit, offset: $offset}, filter: $filter) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...ScheduleParts
    }
  }
}
    ${SchedulePartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetSchedulesPageGQL extends Apollo.Query<GetSchedulesPageQuery, GetSchedulesPageQueryVariables> {
    document = GetSchedulesPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOneScheduleDocument = gql`
    mutation updateOneSchedule($id: ID!, $update: UpdateSchedule!) {
  updateOneSchedule(input: {id: $id, update: $update}) {
    ...ScheduleParts
  }
}
    ${SchedulePartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOneScheduleGQL extends Apollo.Mutation<UpdateOneScheduleMutation, UpdateOneScheduleMutationVariables> {
    document = UpdateOneScheduleDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOneScheduleDocument = gql`
    mutation deleteOneSchedule($id: ID!) {
  deleteOneSchedule(input: {id: $id}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteOneScheduleGQL extends Apollo.Mutation<DeleteOneScheduleMutation, DeleteOneScheduleMutationVariables> {
    document = DeleteOneScheduleDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOneStudentDocument = gql`
    mutation createOneStudent($student: CreateStudent!) {
  createOneStudent(input: {student: $student}) {
    ...StudentParts
  }
}
    ${StudentPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOneStudentGQL extends Apollo.Mutation<CreateOneStudentMutation, CreateOneStudentMutationVariables> {
    document = CreateOneStudentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetStudentsPageDocument = gql`
    query getStudentsPage($offset: Int = 0, $limit: Int = 10, $filter: StudentFilter = {}) {
  students(paging: {limit: $limit, offset: $offset}, filter: $filter) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...StudentParts
    }
  }
}
    ${StudentPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetStudentsPageGQL extends Apollo.Query<GetStudentsPageQuery, GetStudentsPageQueryVariables> {
    document = GetStudentsPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchStudentDocument = gql`
    query fetchStudent($offset: Int = 0, $limit: Int = 10, $filter: StudentFilter = {}) {
  students(paging: {limit: $limit, offset: $offset}, filter: $filter) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...StudentParts
    }
  }
}
    ${StudentPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchStudentGQL extends Apollo.Query<FetchStudentQuery, FetchStudentQueryVariables> {
    document = FetchStudentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOneStudentDocument = gql`
    mutation updateOneStudent($id: ID!, $update: UpdateStudent!) {
  updateOneStudent(input: {id: $id, update: $update}) {
    ...StudentParts
  }
}
    ${StudentPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOneStudentGQL extends Apollo.Mutation<UpdateOneStudentMutation, UpdateOneStudentMutationVariables> {
    document = UpdateOneStudentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOneStudentDocument = gql`
    mutation deleteOneStudent($id: ID!) {
  deleteOneStudent(input: {id: $id}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteOneStudentGQL extends Apollo.Mutation<DeleteOneStudentMutation, DeleteOneStudentMutationVariables> {
    document = DeleteOneStudentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetDocumentPageDocument = gql`
    query getDocumentPage($studentId: ID!, $offset: Int = 0, $limit: Int = 10) {
  documents(
    filter: {students: {id: {eq: $studentId}}}
    paging: {offset: $offset, limit: $limit}
  ) {
    totalCount
    nodes {
      ...DocumentParts
    }
  }
}
    ${DocumentPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetDocumentPageGQL extends Apollo.Query<GetDocumentPageQuery, GetDocumentPageQueryVariables> {
    document = GetDocumentPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOneDocumentDocument = gql`
    mutation createOneDocument($document: CreateDocument!) {
  createOneDocument(input: {document: $document}) {
    ...DocumentParts
  }
}
    ${DocumentPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOneDocumentGQL extends Apollo.Mutation<CreateOneDocumentMutation, CreateOneDocumentMutationVariables> {
    document = CreateOneDocumentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddStudentsToDocumentDocument = gql`
    mutation addStudentsToDocument($id: ID!, $relationIds: [ID!]!) {
  addStudentsToDocument(input: {id: $id, relationIds: $relationIds}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddStudentsToDocumentGQL extends Apollo.Mutation<AddStudentsToDocumentMutation, AddStudentsToDocumentMutationVariables> {
    document = AddStudentsToDocumentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RemoveStudentsFromDocumentDocument = gql`
    mutation removeStudentsFromDocument($id: ID!, $relationIds: [ID!]!) {
  removeStudentsFromDocument(input: {id: $id, relationIds: $relationIds}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveStudentsFromDocumentGQL extends Apollo.Mutation<RemoveStudentsFromDocumentMutation, RemoveStudentsFromDocumentMutationVariables> {
    document = RemoveStudentsFromDocumentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOneDocumentDocument = gql`
    mutation deleteOneDocument($id: ID!) {
  deleteOneDocument(input: {id: $id}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteOneDocumentGQL extends Apollo.Mutation<DeleteOneDocumentMutation, DeleteOneDocumentMutationVariables> {
    document = DeleteOneDocumentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOneTeacherDocument = gql`
    mutation createOneTeacher($teacher: CreateTeacher!) {
  createOneTeacher(input: {teacher: $teacher}) {
    ...TeacherParts
  }
}
    ${TeacherPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOneTeacherGQL extends Apollo.Mutation<CreateOneTeacherMutation, CreateOneTeacherMutationVariables> {
    document = CreateOneTeacherDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetTeachersPageDocument = gql`
    query getTeachersPage($offset: Int = 0, $limit: Int = 10, $filter: TeacherFilter = {}) {
  teachers(paging: {limit: $limit, offset: $offset}, filter: $filter) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...TeacherParts
    }
  }
}
    ${TeacherPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetTeachersPageGQL extends Apollo.Query<GetTeachersPageQuery, GetTeachersPageQueryVariables> {
    document = GetTeachersPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchTeacherDocument = gql`
    query fetchTeacher($offset: Int = 0, $limit: Int = 10, $filter: TeacherFilter = {}) {
  teachers(paging: {limit: $limit, offset: $offset}, filter: $filter) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...TeacherParts
    }
  }
}
    ${TeacherPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchTeacherGQL extends Apollo.Query<FetchTeacherQuery, FetchTeacherQueryVariables> {
    document = FetchTeacherDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOneTeacherDocument = gql`
    mutation updateOneTeacher($id: ID!, $update: UpdateTeacher!) {
  updateOneTeacher(input: {id: $id, update: $update}) {
    ...TeacherParts
  }
}
    ${TeacherPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOneTeacherGQL extends Apollo.Mutation<UpdateOneTeacherMutation, UpdateOneTeacherMutationVariables> {
    document = UpdateOneTeacherDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOneTeacherDocument = gql`
    mutation deleteOneTeacher($id: ID!) {
  deleteOneTeacher(input: {id: $id}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteOneTeacherGQL extends Apollo.Mutation<DeleteOneTeacherMutation, DeleteOneTeacherMutationVariables> {
    document = DeleteOneTeacherDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetUsersPageDocument = gql`
    query getUsersPage($offset: Int = 0, $limit: Int = 10, $filter: UserFilter = {}) {
  users(paging: {limit: $limit, offset: $offset}, filter: $filter) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    nodes {
      ...UserParts
    }
  }
}
    ${UserPartsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetUsersPageGQL extends Apollo.Query<GetUsersPageQuery, GetUsersPageQueryVariables> {
    document = GetUsersPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOneUserDocument = gql`
    mutation createOneUser($input: SignUpInput!) {
  signUp(input: $input) {
    id
    username
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOneUserGQL extends Apollo.Mutation<CreateOneUserMutation, CreateOneUserMutationVariables> {
    document = CreateOneUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOneUserDocument = gql`
    mutation updateOneUser($id: ID!, $update: UpdateUser!) {
  updateOneUser(input: {id: $id, update: $update}) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOneUserGQL extends Apollo.Mutation<UpdateOneUserMutation, UpdateOneUserMutationVariables> {
    document = UpdateOneUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOneUserDocument = gql`
    mutation deleteOneUser($id: ID!) {
  deleteOneUser(input: {id: $id}) {
    id
    username
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteOneUserGQL extends Apollo.Mutation<DeleteOneUserMutation, DeleteOneUserMutationVariables> {
    document = DeleteOneUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetUserPoliciesDocument = gql`
    query getUserPolicies($id: ID!) {
  user(id: $id) {
    policies {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetUserPoliciesGQL extends Apollo.Query<GetUserPoliciesQuery, GetUserPoliciesQueryVariables> {
    document = GetUserPoliciesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }