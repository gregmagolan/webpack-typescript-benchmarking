package(default_visibility=["//visibility:public"])
load("@build_bazel_rules_typescript//:defs.bzl", "ts_library")

exports_files(["tsconfig.json"])

ts_library(
  name = "rxjs",
  module_name = "rxjs",
  srcs = glob(["*.ts", "**/*.ts"]),
  tsconfig = "//:tsconfig.json",
)
