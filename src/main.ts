// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as core from "@actions/core";

declare function require(name: string);
const Asana = require("asana");

/* Edit Function */
const run = async (): Promise<void> => {
  try {
    const client = Asana.ApiClient.instance;
    const token = client.authentications["token"];
    token.accessToken = core.getInput("asana-secret", { required: true });

    const workspaceId = core.getInput("asana-workspace-id", { required: true });
    const projectId = core.getInput("asana-project-id", { required: true });
    const sectionId = core.getInput("asana-section-id", { required: true });
    const taskName = core.getInput("asana-task-name", { required: true });
    const taskDescription = core.getInput("asana-task-description");
    const dueDate = core.getInput("asana-due-date");
    //const tags = core.getInput("asana-tags");

    const tasksApiInstance = new Asana.TasksApi();
    const body = {
      data: {
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
        assignee_section: sectionId,
        //tags: tags ? JSON.parse(tags) : "",
      },
    };
    const opts = {};
    const result = await tasksApiInstance.createTask(body, opts);

    return result["data"]["permalink_url"];
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
