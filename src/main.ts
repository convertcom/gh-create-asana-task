import * as core from "@actions/core";

import * as Asana from "asana";

/* Edit Function */
const run = async (): Promise<void> => {
  try {
    const client = Asana.Client.create().useAccessToken(
      core.getInput("asana-secret", { required: true }),
    );

    // const token = core.getInput("asana-secret", { required: true });
    // core.setSecret(token);
    // const client = asana.Client.create({
    //   defaultHeaders: {
    //     "asana-enable": "new_project_templates,new_user_task_lists",
    //   },
    // }).useAccessToken(token);

    const workspaceId = core.getInput("asana-workspace-id", { required: true });
    const projectId = core.getInput("asana-project-id", { required: true });
    //const sectionId = core.getInput("asana-section-id", { required: true });
    const taskName = core.getInput("asana-task-name", { required: true });
    const taskDescription = core.getInput("asana-task-description");
    const dueDate = core.getInput("asana-due-date");
    const tags = core.getInput("asana-tags");

    const body = {
      name: taskName,
      approval_status: "pending",
      assignee_status: "upcoming",
      completed: false,
      notes: taskDescription,
      is_rendered_as_separator: false,
      liked: true,
      projects: [projectId],
      due_on: dueDate,
      workspace: workspaceId,
      tags: tags ? JSON.parse(tags) : "",
    };
    const opts = {};

    await client.tasks.create(body, opts);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) core.setFailed(error.message);
  }
};

// const getAssignee = async (): Promise<string | undefined> => {
//   let assignee;

//   const githubToken = core.getInput("github-token");
//   const octokit = github.getOctokit(githubToken);
//   const commitSha =
//     github.context.payload.pull_request?.head.sha ?? github.context.sha;
//   const { data: commit } = await octokit.rest.git.getCommit({
//     commit_sha: commitSha,
//     owner: github.context.repo.owner,
//     repo: github.context.repo.repo,
//   });

//   return assignee;
// };

run();
