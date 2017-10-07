def _sources_aspect_impl(target, ctx):
  result = depset()
  if hasattr(ctx.rule.attr, "deps"):
    for dep in ctx.rule.attr.deps:
      if hasattr(dep, "es5_sources"):
        result += dep.es5_sources
  # Note layering: until we have JS interop providers, this needs to know how to
  # get TypeScript outputs.
  if hasattr(target, "typescript"):
    result += target.typescript.es5_sources
  elif hasattr(target, "files"):
    result += target.files
  return struct(es5_sources = result)

sources_aspect = aspect(
    _sources_aspect_impl,
    attr_aspects = ["deps"],
)


def _concat_bundle_impl(ctx):
  sources = depset(ctx.attr.srcs)
  for d in ctx.attr.deps:
    if hasattr(d, "es5_sources"):
      sources += d.es5_sources

  ctx.actions.run_shell(
      inputs = sources,
      outputs = [ctx.outputs.bundle],
      command = "out=$1; shift; cat $@ > $out",
      arguments = [ctx.outputs.bundle.path] + [s.path for s in sources]
  )
  return []

concat_bundle = rule(
    implementation = _concat_bundle_impl,
    attrs = {
        "srcs": attr.label_list(allow_files = [".js"]),
        "deps": attr.label_list(
            aspects = [sources_aspect]
        ),
    },
    outputs = {
        "bundle": "%{name}.js"
    },
)